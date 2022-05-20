interface LoginFields {
    email: string
    password?: string
}

interface AssessmentFields {
    title: string
    description: string
    deadline: Date
}

interface GradeFields {
    mark: string
    comment: string
}

interface SubmissionFields {
    links: Array<string>
    submittedAt: Date
}

export default interface UserFields extends LoginFields {
    name: string
    role: string
}

export { LoginFields, AssessmentFields, SubmissionFields, GradeFields }
