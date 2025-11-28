// Member Types for Fitness Platform
export enum MemberType{
    USER = 'USER',                   // Regular fitness enthusiast
    TRAINER = 'TRAINER',             // Personal trainer/instructor
    ADMIN = 'ADMIN',                 // Platform admin
}


export enum MemberStatus{
    ACTIVE ='ACTIVE',      // Active account
    BLOCK = 'BLOCK',       // Blocked account
    DELETED= 'DELETED',    // Deleted account
    SUSPENDED = 'SUSPENDED', // Temporarily suspended
}


export enum MemberAuthType{
    PHONE = 'PHONE',
    EMAIL = 'EMAIL',
    TELEGRAM = 'TELEGRAM',
    GOOGLE = 'GOOGLE',     // Google OAuth
    APPLE = 'APPLE',       // Apple Sign In
}
