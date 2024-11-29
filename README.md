# **AlgoBuzz - The Ultimate Coding Platform**  

Welcome to **AlgoBuzz**, a one-stop solution for coding enthusiasts! Designed to elevate your coding experience, AlgoBuzz offers advanced tools and features to help you solve 100+ DSA problems, streamline competitive programming contests with **CF-Buddy**, and use an integrated online IDE for seamless coding and debugging.  

---

## **Features**  

- **100+ DSA Problems**: Tackle a wide range of curated problems designed to strengthen your data structures and algorithms skills.  
- **CF-Buddy**: A dedicated **Codeforces Interface** that simplifies the process of participating in contests by providing real-time updates, efficient workflows, and performance insights.  
- **Online IDE**: Write, test, and debug your code with our integrated, fast, and reliable online IDE.  

---

## **Project Architecture**  

AlgoBuzz is a robust, scalable application built using modern tools and architecture. Here's how the project is structured:  

### **Frontend (Root Project)**  
- **Framework**: [Next.js](https://nextjs.org/) for server-side rendering and a seamless user experience.  
- **Authentication**: Powered by [Clerk](https://clerk.dev/) for secure, easy-to-manage user authentication.  
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) as the ORM for managing database operations.  

### **Supporting Services**  
1. **Code-Execution Worker**: Handles secure and isolated code execution for the online IDE.  
   - [https://github.com/VishalSh20/code-solver-worker](#)  
2. **CF-Interface Worker**: Streamlines interactions with the Codeforces API to provide real-time contest and user data.  
   - [https://github.com/VishalSh20/cf-interface](#)  

These microservices are hosted on dedicated servers for optimal performance and reliability.  

---

## **Tech Stack**  

| Component        | Technology                  |  
|------------------|-----------------------------|  
| Frontend         | Next.js                     |  
| Authentication   | Clerk                       |  
| Database         | PostgreSQL with Prisma ORM  |  
| Microservices    | Node.js Workers             |  

---



 

