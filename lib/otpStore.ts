// Shared OTP store
// export const otpStore: { [email: string]: string } = {}

export const otpStore: {
    [email: string]: {
      otp: string
      expiresAt: number
    }
  } = {}
  
