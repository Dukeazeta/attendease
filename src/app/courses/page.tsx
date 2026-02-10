"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
    const courses = useQuery(api.courses.list);
    const createCourse = useMutation(api.courses.create);
    const removeCourse = useMutation(api.courses.remove);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createCourse({
                courseCode: formData.get("courseCode") as string,
                courseTitle: formData.get("courseTitle") as string,
            });
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add course");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: Id<"courses">) => {
        if (!confirm("Delete this course? All associated sessions will also be deleted.")) return;
        try {
            await removeCourse({ id });
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete course");
        }
    };

    if (courses === undefined) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-[450] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <div className="h-5 w-px bg-border" />
                    <h1 className="text-[15px] font-[450] text-foreground">Manage Courses</h1>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
                {/* Add Course Form */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface-elevated p-6"
                >
                    <h2 className="text-[14.5px] font-[450] text-foreground mb-5 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-accent" />
                        Add New Course
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            name="courseCode"
                            placeholder="Course Code (e.g., CSC301)"
                            required
                            className="flex-1"
                        />
                        <Input
                            name="courseTitle"
                            placeholder="Course Title (e.g., Computer Architecture)"
                            required
                            className="flex-1"
                        />
                        <Button type="submit" isLoading={isSubmitting} className="sm:w-auto">
                            Add Course
                        </Button>
                    </form>
                </motion.div>

                {/* Courses List */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="surface-elevated overflow-hidden rounded-xl"
                >
                    <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                        <BookOpen className="w-[18px] h-[18px] text-muted-foreground" />
                        <h2 className="text-[15px] font-[450] text-foreground">Your Courses</h2>
                        <span className="ml-auto text-small text-muted-foreground">{courses.length} total</span>
                    </div>
                    {courses.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-caption text-muted-foreground">No courses added yet. Add your first course above!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {courses.map((course: any) => (
                                <div key={course._id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container/50 transition-colors">
                                    <div>
                                        <h3 className="text-[14.5px] font-[450] text-foreground">{course.courseCode}</h3>
                                        <p className="text-small text-muted-foreground mt-0.5">{course.courseTitle}</p>
                                        <p className="text-[11px] text-muted-foreground/60 mt-1">{course.sessionCount} session(s)</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="p-2.5 rounded-full hover:bg-destructive/8 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
