import asyncio
from datetime import date
from sqlalchemy import select, func
from app.database import AsyncSessionLocal, engine, Base
from app.models import Employee


SAMPLE_EMPLOYEES = [
    {"id": "M1001", "name": "Rahul Sharma", "email": "rahul.sharma@company.com", "department": "Engineering", "designation": "Backend Dev", "date_of_joining": date(2021, 6, 15)},
    {"id": "M2002", "name": "Rahul Verma", "email": "rahul.verma@company.com", "department": "Engineering", "designation": "Software Dev II", "date_of_joining": date(2022, 1, 10)},
    {"id": "F4001", "name": "Priya Patel", "email": "priya.patel@company.com", "department": "Product", "designation": "Product Manager", "date_of_joining": date(2020, 3, 1)},
    {"id": "M3003", "name": "Aarav Gupta", "email": "aarav.gupta@company.com", "department": "Engineering", "designation": "DevOps Architect", "date_of_joining": date(2021, 11, 20)},
    {"id": "F5002", "name": "Sneha Reddy", "email": "sneha.reddy@company.com", "department": "Human Resources", "designation": "Business Partner", "date_of_joining": date(2019, 8, 12)},
    {"id": "M1004", "name": "Rohan Mehta", "email": "rohan.mehta@company.com", "department": "Finance", "designation": "Financial Analyst", "date_of_joining": date(2023, 2, 14)},
    {"id": "F6003", "name": "Ananya Iyer", "email": "ananya.iyer@company.com", "department": "Design", "designation": "Product Designer", "date_of_joining": date(2021, 9, 5)},
    {"id": "M2005", "name": "Vikram Singh", "email": "vikram.singh@company.com", "department": "Engineering", "designation": "Frontend Specialist", "date_of_joining": date(2022, 7, 18)},
    {"id": "F4004", "name": "Kavita Nair", "email": "kavita.nair@company.com", "department": "Marketing", "designation": "Growth Marketing", "date_of_joining": date(2020, 10, 25)},
    {"id": "M3006", "name": "Amit Joshi", "email": "amit.joshi@company.com", "department": "Sales", "designation": "Account Exec", "date_of_joining": date(2021, 4, 30)},
    {"id": "F5005", "name": "Divya Singh", "email": "divya.deshmukh@company.com", "department": "Engineering", "designation": "Automation Dev", "date_of_joining": date(2023, 5, 2)},
    {"id": "M1007", "name": "Karan Chopra", "email": "karan.malhotra@company.com", "department": "Operations", "designation": "Operations Director", "date_of_joining": date(2018, 12, 1)},
    {"id": "F6006", "name": "Neha Kapoor", "email": "neha.kapoor@company.com", "department": "Legal", "designation": "Legal Counsel", "date_of_joining": date(2022, 8, 22)},
    {"id": "M2008", "name": "Aditya Rao", "email": "aditya.rao@company.com", "department": "Engineering", "designation": "Site Reliability Dev", "date_of_joining": date(2021, 1, 15)},
    {"id": "F4007", "name": "Pooja Hegde", "email": "pooja.hegde@company.com", "department": "Customer Success", "designation": "Support Team", "date_of_joining": date(2022, 11, 8)},
    {"id": "M3009", "name": "Sidh Jain", "email": "siddharth.jain@company.com", "department": "Finance", "designation": "Senior Accountant", "date_of_joining": date(2020, 5, 19)},
    {"id": "F5008", "name": "Meera Nambiar", "email": "meera.nambiar@company.com", "department": "Product", "designation": "Technical Writer", "date_of_joining": date(2023, 3, 10)},
    {"id": "M1010", "name": "Rajesh Kumar", "email": "rajesh.kumar@company.com", "department": "Engineering", "designation": "Principal Architect", "date_of_joining": date(2017, 4, 1)},
    {"id": "F6009", "name": "Tanvi Bhatia", "email": "tanvi.bhatia@company.com", "department": "Human Resources", "designation": "Talent Acquisition", "date_of_joining": date(2022, 9, 14)},
    {"id": "M2011", "name": "Varun Chopra", "email": "varun.chopra@company.com", "department": "Marketing", "designation": "Content Strategist", "date_of_joining": date(2023, 6, 20)},
    {"id": "F4010", "name": "Ishita Saxena", "email": "ishita.saxena@company.com", "department": "Engineering", "designation": "Data Engineer", "date_of_joining": date(2021, 12, 11)},
    {"id": "M3012", "name": "Manish Tiwari", "email": "manish.tiwari@company.com", "department": "Sales", "designation": "Sales Rep", "date_of_joining": date(2023, 8, 1)},
    {"id": "F5011", "name": "Ritu Agarwal", "email": "ritu.agarwal@company.com", "department": "Design", "designation": "UX Designer", "date_of_joining": date(2022, 4, 18)},
    {"id": "M1013", "name": "Harsh Vardhan", "email": "harsh.vardhan@company.com", "department": "Engineering", "designation": "Security Engineer", "date_of_joining": date(2020, 2, 28)},
    {"id": "F6012", "name": "Swati Ghosh", "email": "swati.ghosh@company.com", "department": "Customer Success", "designation": "Client Manager", "date_of_joining": date(2021, 7, 7)},
]


async def seed():
    print("Connecting to database")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        print(f"Seeding {len(SAMPLE_EMPLOYEES)} sample records")
        for emp_data in SAMPLE_EMPLOYEES:
            emp = Employee(**emp_data)
            session.add(emp)

        await session.commit()
        print("Database successfully seeded yayayayay")

#Added to prevent WARNING event loop closed since its Async process
    await engine.dispose()
    await asyncio.sleep(0.1)


if __name__ == "__main__":
    asyncio.run(seed())
