import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from app.config import settings
from app.models import User
from app.api.auth import DEMO_USERS

engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def insert_users():
    async with async_session() as session:
        for u in DEMO_USERS.values():
            user = User(
                id=u['id'],
                username=u['username'],
                email=u['email'],
                password_hash=u['password_hash'],
                full_name=u['full_name'],
                role=u['role'],
                organization=u['organization'],
                subsidiary=u.get('subsidiary'),
                department=u.get('department'),
                designation=u.get('designation')
            )
            session.add(user)
        try:
            await session.commit()
            print('Users inserted successfully.')
        except Exception as e:
            print(f'Error: {e}')

asyncio.run(insert_users())
