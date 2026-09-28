"""Chat Service with Colab API Integration"""
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import HTTPException
import httpx
from sqlalchemy.orm import Session

from app.config.settings import Settings
from app.models.database import Usuario, Conversacion, Mensaje, ConsumoToken
from app.schemas.chat_schemas import ChatResponse


logger = logging.getLogger(__name__)


class ChatService:
    """Handles chat message processing, Colab API integration, and token tracking"""
    
    def __init__(self, db: Session, config: Settings):
        self.db = db
        self.config = config
        self.colab_api_url = config.colab_api_url
        self.timeout = 30  # seconds
    
    async def send_to_colab(self, message: str) -> Dict:
        """Send message to Colab API and return response"""
        if not self.colab_api_url:
            raise HTTPException(status_code=500, detail="Chatbot service not configured")
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.colab_api_url,
                    json={"message": message}
                )
                
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=503,
                        detail="Chatbot service temporarily unavailable"
                    )
                
                return response.json()
                
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Chatbot service timeout")
        except Exception as e:
            logger.error(f"Colab API error: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="Chatbot service temporarily unavailable"
            )
    
    def get_or_create_conversation(self, user_id: int) -> Conversacion:
        """Get most recent conversation or create new one"""
        # Look for conversation created in last 24 hours
        cutoff = datetime.utcnow() - timedelta(hours=24)
        
        conversation = self.db.query(Conversacion).filter(
            Conversacion.id_usuario == user_id,
            Conversacion.fecha_creacion >= cutoff
        ).order_by(Conversacion.fecha_creacion.desc()).first()
        
        if not conversation:
            conversation = Conversacion(
                id_usuario=user_id,
                fecha_creacion=datetime.utcnow()
            )
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)
        
        return conversation
    
    def save_message(self, conversation_id: int, role: str, content: str) -> Mensaje:
        """Save message to database"""
        if role not in ["user", "assistant"]:
            raise HTTPException(
                status_code=422,
                detail="ROL must be either 'user' or 'assistant'"
            )
        
        message = Mensaje(
            id_conversacion=conversation_id,
            rol=role,
            contenido=content,
            fecha=datetime.utcnow()
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
        return message
    
    def track_tokens(self, message_id: int, token_data: Dict) -> None:
        """Track token consumption from Colab response"""
        try:
            # Extract token information from response
            prompt_tokens = token_data.get("prompt_tokens", 0)
            completion_tokens = token_data.get("completion_tokens", 0)
            total_tokens = token_data.get("total_tokens", 0)
            
            # Validate token values
            if any(isinstance(t, (int, float)) and (t < 0 or t > 1000000) 
                   for t in [prompt_tokens, completion_tokens, total_tokens]):
                logger.warning(f"Invalid token values in response: {token_data}")
                prompt_tokens = completion_tokens = total_tokens = 0
            
            # Store token records
            for categoria, tokens in [
                ("prompt_tokens", prompt_tokens),
                ("completion_tokens", completion_tokens),
                ("total_tokens", total_tokens)
            ]:
                consumo = ConsumoToken(
                    id_mensaje=message_id,
                    categoria=categoria,
                    tokens=int(tokens),
                    fecha=datetime.utcnow()
                )
                self.db.add(consumo)
            
            self.db.commit()
            
        except Exception as e:
            # Log error but don't fail the chat response
            logger.error(f"Failed to track tokens: {str(e)}")
            
            # Store unavailable record
            consumo = ConsumoToken(
                id_mensaje=message_id,
                categoria="unavailable",
                tokens=0,
                fecha=datetime.utcnow()
            )
            self.db.add(consumo)
            self.db.commit()
    
    async def process_chat(self, message: str, user: Optional[Usuario]) -> ChatResponse:
        """Process complete chat flow"""
        # Determine user ID (1 for anonymous)
        user_id = user.id_usuario if user else 1
        
        # Get or create conversation
        conversation = self.get_or_create_conversation(user_id)
        
        # Save user message
        user_message = self.save_message(conversation.id_conversacion, "user", message)
        
        # Send to Colab API
        colab_response = await self.send_to_colab(message)
        
        # Extract chatbot response text
        response_text = colab_response.get("response", "")
        
        # Save assistant message
        assistant_message = self.save_message(
            conversation.id_conversacion,
            "assistant",
            response_text
        )
        
        # Track token consumption
        token_data = colab_response.get("usage", {})
        self.track_tokens(assistant_message.id_mensaje, token_data)
        
        return ChatResponse(
            response=response_text,
            conversation_id=conversation.id_conversacion,
            message_id=assistant_message.id_mensaje
        )
