
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#b77b4d]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-[#2f5d62]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-96 w-96 rounded-full bg-[#d9c6a5]/20 blur-3xl" />
      </div>

      <div className="flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2.25rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_120px_rgba(17,24,39,0.12)] backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="grid gap-0 overflow-hidden rounded-[1.75rem] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border-b border-slate-200/70 bg-white px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
            <p className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
              JD Agentic Test System
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Turn a job description into a structured interview test.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Paste the job description, tune the role context, and generate a
              clean test with MCQ, coding, and scenario prompts from the backend
              workflow.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Input
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Job description + role title
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Generation
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  FastAPI + LangGraph workflow
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Output
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Summary + question set on the same page
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[linear-gradient(180deg,#0f172a_0%,#14213d_100%)] px-6 py-8 text-white sm:px-10 lg:px-12 lg:py-12">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/60">
                  Backend contract
                </p>
                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/10">
                  <p className="text-sm text-white/70">POST /api/v1/generate-test</p>
                  <pre className="mt-4 overflow-x-auto text-xs leading-6 text-white/85">{`{
  "job_description": "...",
  "role_title": "Backend Engineer",
  "question_count": 10,
  "difficulty": "medium"
}`}</pre>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Response shape
                  </p>
                  <p className="mt-2 text-sm text-white/85">
                    role_title, summary, total_questions, questions[]
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Direct call
                  </p>
                  <p className="mt-2 text-sm text-white/85">
                    Frontend calls the FastAPI backend directly
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        </section>
      </div>
    </main>
  );
}
