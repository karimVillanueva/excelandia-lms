export interface Account {
    id: string;
    email: string;
    status: string;
    cognito_sub: string;
    stripe_customer_id: string | null;
}

export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    country: string | null;
}

export interface Enrollment {
    id: string;
    status: string;
    starts_at: string;
    ends_at: string;
    course_id: {
        id: string;
        title: string;
        slug: string;
        thumbnail?: string;
    };
}

export interface MeResponse {
    authenticated: boolean;
    email: string;
    cognito_sub: string;
    account: Account | null;
    student: Student | null;
    enrollments: Enrollment[];
}