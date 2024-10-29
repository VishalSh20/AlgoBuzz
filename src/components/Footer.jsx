'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 xl:px-12 2xl:px-16 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row w-full justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-2 logo-gradient">GSCodeSolver</h2>
            <p className="text-base tracking-wider">
              Made with <span className="text-red-500">❤️</span> by Vishal Sharma & <span><Link href="https://github.com/kumarpritam1468">Pritam Manohari</Link></span>
            </p>
          </div>

          <div className="text-center md:text-right">
            <ul className='flex flex-col gap-2 p-2'>
              <li>
                <Link
                  href="https://github.com/VishalSh20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/in/vishal-sharma-b77132201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  LinkedIn
                </Link>
              </li>
              <li className=' flex flex-col'>
                <Link
                  href="mailto:vishal.sharma14052002@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  Email: vishal.sharma14052002@gmail.com
                </Link>
                <Link
                  href="mailto:manoharipritam@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  manoharipritam@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} GSCodeSolver. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
