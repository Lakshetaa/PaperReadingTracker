import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar.js';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Paper Reading Tracker',
  description: 'Track your academic paper reading progress',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
