export const validateStudentEmail = (email) => {
    // Add your student email validation logic
    const studentEmailPattern = /.edu$/;
    return studentEmailPattern.test(email);
  };
  
  export const generateSessionToken = () => {
    return crypto.randomBytes(32).toString('hex');
  };
  