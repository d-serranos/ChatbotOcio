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
    
    async def send_to_colab(self, message: str, user_id: Optional[int] = None) -> Dict:
        """Send message to Colab API and return response"""
        if not self.colab_api_url:
            raise HTTPException(status_code=500, detail="Chatbot service not configured")
        
        try:
            # Preparar payload seg?n formato de Colab API
            payload = {
                "pregunta": message,
                "usuario_id": str(user_id) if user_id else None
            }
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.colab_api_url,
                    json=payload
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
    
    def track_response_tokens(self, message_id: int, response_content: str) -> None:
        """Track token consumption for assistant response based on word count"""
        try:
            # Contar palabras en la respuesta del chatbot
            word_count = len(response_content.split())
            
            # Guardar consumo de tokens con categoria "resultado"
            consumo = ConsumoToken(
                id_mensaje=message_id,
                categoria="resultado",
                tokens=word_count,
                fecha=datetime.utcnow()
            )
            self.db.add(consumo)
            self.db.commit()
            
            logger.info(f"Assistant response tokens tracked: {word_count} words")
            
        except Exception as e:
            logger.error(f"Failed to track response tokens: {str(e)}")
    
    def track_user_message_tokens(self, message_id: int, message_content: str) -> None:
        """Track token consumption for user message based on word count"""
        try:
            # Contar palabras en el mensaje del usuario
            word_count = len(message_content.split())
            
            # Guardar consumo de tokens con categor?a "general"
            consumo = ConsumoToken(
                id_mensaje=message_id,
                categoria="enviados",
                tokens=word_count,
                fecha=datetime.utcnow()
            )
            self.db.add(consumo)
            self.db.commit()
            
            logger.info(f"User message tokens tracked: {word_count} words")
            
        except Exception as e:
            logger.error(f"Failed to track user message tokens: {str(e)}")
    
    async def process_chat(self, message: str, user: Optional[Usuario]) -> ChatResponse:
        """Process complete chat flow"""
        # Determine user ID (1 for anonymous)
        user_id = user.id_usuario if user else 1
        
        # Get or create conversation
        conversation = self.get_or_create_conversation(user_id)
        
        # Save user message
        user_message = self.save_message(conversation.id_conversacion, "user", message)
        
        # Track user message word count as tokens (category: enviados)
        self.track_user_message_tokens(user_message.id_mensaje, message)
        
        # Send to Colab API
        colab_response = await self.send_to_colab(message, user_id)
        
        # Extract chatbot response text from Colab format
        response_text = colab_response.get("respuesta", "")
        
        # Save assistant message
        assistant_message = self.save_message(
            conversation.id_conversacion,
            "assistant",
            response_text
        )
        
        # Track response word count as tokens (category: resultado)
        self.track_response_tokens(assistant_message.id_mensaje, response_text)
        
        return ChatResponse(
            response=response_text,
            conversation_id=conversation.id_conversacion,
            message_id=assistant_message.id_mensaje
        )
