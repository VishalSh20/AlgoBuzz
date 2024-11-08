import Link from 'next/link'
import { CodeXml, Squirrel } from "lucide-react"

const Features = () => {
    return (
        <section className=' w-full h-fit pt-6 pb-24 flex items-center justify-center text-white relative' id='feature-section'>
            <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#6666662e_1px,transparent_1px),linear-gradient(to_bottom,#6666662e_1px,transparent_1px)] bg-[size:14px_24px] mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#ffffff_100%,transparent_100%)]">
            </div>
            <div className=" flex flex-col justify-center items-center gap-16 relative z-10">
                <h1 className=' text-5xl font-medium tracking-wider'>
                    Our <span className=' text-text-main underline underline-offset-8 decoration-wavy '>Features</span>
                </h1>

                <div className=' flex gap-12 items-center justify-center w-2/3 max-lg:w-full max-lg:px-10 max-md:flex-col'>
                    <div className=' flex flex-1 flex-col gap-5 px-6 py-8 bg-gray-800/80 rounded-2xl border border-transparent hover:border-text-main hover:-translate-y-1.5 cursor-pointer transition-all duration-300 ease-in-out'>
                        <h2 className=' text-text-main text-2xl font-medium flex gap-3 items-center'>
                            <CodeXml size={30} />
                            IDE
                        </h2>
                        <p className=' text-gray-200'>
                            A powerful Integrated Development Environment to code, debug, and run your projects seamlessly.
                        </p>
                        <Link href="/ide" className=' button-gradient2 mt-2 hover:scale-100'>
                            Try Now
                        </Link>
                    </div>
                    <div className=' flex flex-1 flex-col gap-5 px-6 py-8 bg-gray-800/80 rounded-2xl border border-transparent hover:border-text-main hover:-translate-y-1.5 cursor-pointer transition-all duration-300 ease-in-out'>
                        <h2 className=' text-text-main text-2xl font-medium flex gap-3 items-center'>
                            <Squirrel size={30} />
                            CF-BUDDY
                        </h2>
                        <p className=' text-gray-200'>
                            Upload and solve coding problems with ease, enhancing your productivity and efficiency in tackling challenges.
                        </p>
                        <Link href="/cf-buddy" className=' button-gradient2 mt-2 hover:scale-100'>
                            Try Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features