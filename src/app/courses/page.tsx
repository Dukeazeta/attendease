import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function createCourse(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user) return;

    const courseCode = formData.get("courseCode") as string;
    const courseTitle = formData.get("courseTitle") as string;

    await db.course.create({
        data: {
            courseCode,
            courseTitle,
            repId: session.user.id,
        },
    });

    revalidatePath("/courses");
}

async function deleteCourse(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user) return;

    const courseId = formData.get("courseId") as string;

    await db.course.delete({
        where: { id: courseId, repId: session.user.id },
    });

    revalidatePath("/courses");
}

export default async function CoursesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const courses = await db.course.findMany({
        where: { repId: session.user.id },
        include: {
            _count: { select: { sessions: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>
                    <div className="h-5 w-px bg-[var(--border-default)]" />
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">Manage Courses</h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Course Form */}
                <div className="card-industrial p-6 mb-8 animate-fade-in opacity-0">
                    <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Add New Course</h2>
                    <form action={createCourse} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            name="courseCode"
                            placeholder="Course Code (e.g., CSC301)"
                            required
                            className="flex-1 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                        <input
                            type="text"
                            name="courseTitle"
                            placeholder="Course Title (e.g., Computer Architecture)"
                            required
                            className="flex-1 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                        >
                            Add Course
                        </button>
                    </form>
                </div>

                {/* Courses List */}
                <div className="card-industrial overflow-hidden animate-fade-in-up opacity-0 delay-100">
                    <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
                        <h2 className="text-base font-semibold text-[var(--text-primary)]">Your Courses</h2>
                    </div>
                    {courses.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)]">No courses added yet. Add your first course above!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {courses.map((course) => (
                                <div key={course.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors">
                                    <div>
                                        <h3 className="text-[var(--text-primary)] font-medium">{course.courseCode}</h3>
                                        <p className="text-[var(--text-secondary)] text-sm">{course.courseTitle}</p>
                                        <p className="text-[var(--text-muted)] text-xs mt-1">
                                            {course._count.sessions} session(s)
                                        </p>
                                    </div>
                                    <form action={deleteCourse}>
                                        <input type="hidden" name="courseId" value={course.id} />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[var(--error)]/10 hover:bg-[var(--error)]/20 text-[var(--error)] text-sm rounded-[var(--radius-md)] transition font-medium"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

