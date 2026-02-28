## Project Introduction and Problem Statement
Many job seekers are facing challenges applying for a job, with the very first wall being the resume. Companies may use the applicant tracking system (ATS) automatically filters resumes to quickly check through keywords and structure, rejecting candidates before a human recruiter reviews their application. This creates frustration as applicants need to tailor their resume to be accurately parsed through ATS.

This web application is an online ATS resume checker for users to receive immediate feedback. Users can upload their resume to be parsed and scored to understand how well their resume aligns with ATS expectations. By lowering the barrier to understanding ATS systems, the app empowers users to iterate on their resumes with confidence. For the MVP, the core focus is secure user authentication and reliable resume parsing and scoring. As a stretch goal, users may choose to share high-scoring resumes on a public “billboard,” allowing others to learn from strong examples while giving recruiters a place to discover well-prepared candidates.


## Basic MVP Interactions and Features
- User registration and login  
- Resume file upload (PDF/DOCX)  
- ATS Backend parsing of uploaded resumes  
- Display of score and feedback to the user  
- Save review results (score and feedback) in the database  
- View past review results on the management page 
- Delete past review records  
- (Optional/Stretch Goal) Public billboard showing opt-in high-scoring reviews

## Webpage Template
Homepage:
- Introduction to what ATS is, how it works, and purpose. 
- Provides navigation to to dashboard once logged in

Dashboard: 
- Landing page after login 
- Main navigation hub
- History of user's resumes to edit. 

Feedback and Score:
- After resume upload, the user may review their score here. 
- Details of keywords parsed, strengths, and improvements. 

Resume Upload: 
- Users upload their resume file 
- Resume is parsed and scored by the backend
- Score and parse is saved; not the whole resume file


Homepage <--> Dashboard
Dashboard <--> Homepage, Feedback and Score, and Resume Upload
Feedback and Score <--> Dashboard and Resume Upload
Resume Upload <--> Dashboard and Feedback and Score
