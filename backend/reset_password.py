from passlib.context import CryptContext
from sqlalchemy import create_engine, text

pwd_context = CryptContext(schemes=['pbkdf2_sha256'], deprecated='auto')
db_url = 'postgresql://neondb_owner:npg_qgXG62infHuP@ep-bitter-star-b4h9icvj-pooler.c-6.us-east-2.aws.neon.tech:5432/neondb?sslmode=require'
engine = create_engine(db_url)

new_password = 'admin123'
hashed_password = pwd_context.hash(new_password)

print(f'Nuevo hash: {hashed_password}')
print()

with engine.connect() as conn:
    users = conn.execute(text('SELECT id_usuario, correo, rol FROM usuarios')).fetchall()
    print('Usuarios en la base de datos:')
    for user in users:
        print(f'  ID: {user[0]}, Email: {user[1]}, Rol: {user[2]}')
    print()
    
    if len(users) > 0:
        user_email = users[0][1]
        result = conn.execute(
            text('UPDATE usuarios SET clave = :password WHERE correo = :email'),
            {'password': hashed_password, 'email': user_email}
        )
        conn.commit()
        print(f'Contraseña actualizada para {user_email}')
        print(f'Nueva contraseña: {new_password}')