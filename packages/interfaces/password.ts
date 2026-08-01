const PASSWORD_REQUIREMENTS = [
    ["At least 8 characters", (password: string) => password.length >= 8],
    ["One lowercase letter", (password: string) => /[a-z]/.test(password)],
    ["One uppercase letter", (password: string) => /[A-Z]/.test(password)],
    ["One number", (password: string) => /\d/.test(password)],
] as const;

export function getPasswordRequirementErrors(password: string) {
    return PASSWORD_REQUIREMENTS.filter(([, isMet]) => !isMet(password)).map(([message]) => message);
}
