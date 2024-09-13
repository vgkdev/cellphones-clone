export const getFirebaseUserErrorMessage = (error) => {
    if (error.code === "auth/email-already-in-use") {
      return "Email already in use";
    } else if (error.code === "auth/invalid-email") {
      return "Invalid email";
    } else if (error.code === "auth/weak-password") {
      return "Weak password";
    } else if (error.code === "auth/user-not-found") {
      return "User not found";
    } else if (error.code === "auth/wrong-password") {
      return "Wrong password";
    } else if(error.code === "auth/invalid-credential") {
      return "Invalid credential";
    } else if(error.code === "auth/operation-not-allowed") {
      return "Operation not allowed";
    } else if(error.code === "auth/credential-already-in-use") {
      return "Credential already in use";
    } else if(error.code === "auth/account-exists-with-different-credential") {
      return "Account exists with different credential";
    } else if(error.code === "auth/invalid-verification-code") {
      return "Invalid verification code";
    } else if(error.code === "auth/invalid-verification-id") {
      return "Invalid verification id";
    } else if(error.code === "auth/missing-verification-code") {
      return "Missing verification code";
    } else if(error.code === "auth/missing-verification-id") {
      return "Missing verification id";
    } else if(error.code === "auth/code-expired") {
      return "Code expired";
    }
  
    return "Unknown error. Error code: " + error.code;
  }