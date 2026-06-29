export interface Account {
    id: string;
    email: string;
    status: string;
    cognito_sub: string;
    stripe_customer_id: string | null;
    role?: string;
}

export interface Student {
    id: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    country: string | null;
    city?: string | null;
    timezone?: string | null;
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
        description?: string | null;
        thumbnail?: {
            id: string;
            filename_download: string;
        } | null;
    };
}

export interface DashboardCourse {
    enrollment: Enrollment;
    course: Enrollment["course_id"];
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
    continueUrl: string | null;
}

export interface Certificate {
    id: string;
    certificate_number: string;
    verification_code: string;
    completed_at: string;
    course_id?: {
        id: string;
        title: string;
    };
    pdf_file?: {
        id: string;
        filename_download: string;
    };
}

export interface MeResponse {
    authenticated: boolean;
    email?: string;
    cognito_sub?: string;
    account: Account | null;
    student: Student | null;

    enrollments?: Enrollment[];

    courses?: DashboardCourse[];
    certificates?: Certificate[];
}