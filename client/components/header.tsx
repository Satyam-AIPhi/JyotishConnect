"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/userSlice';

const navLinks = [
  {
    id: 'chat-with-astrologer',
    title: 'Chat with Astrologer',
  },
  {
    id: '/',
    title: 'Free Kundli',
  },
  {
    id: 'kundli-matching',
    title: 'Kundli Matching',
  },
  {
    id: 'horoscopes',
    title: 'Horoscopes',
  },
  {
    id: 'book-pooja',
    title: 'Book a Pooja',
  },
  {
    id: 'astromall',
    title: 'Astromall',
  },
];

export function Header() {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(true);

  // Retrieve the user from Redux store
  const user = useAppSelector(selectUser);
  // Derive authentication status based on user existence
  const isAuthenticated = !!user;

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setScrolled(false);
      } else if (currentScrollY < prevScrollY || currentScrollY === 0) {
        setScrolled(true);
      }

      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleClick = () => {
    setToggle(!toggle);
  };

  const handleMenuClose = () => {
    setToggle(false);
  };

  return (
    <div className="mb-[100px]">
      <div
        className={`bg-white w-full fixed top-0 z-20 transition-all duration-500 ease-in-out ${scrolled ? '' : '-translate-y-full'
          }`}
      >
        <div className="max-w-[94%] mx-auto flex justify-between items-center bg-transparent p-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => {
              setActive('');
              window.scrollTo(0, 0);
            }}
          >
            <p className="text-black text-[18px] font-bold cursor-pointer flex ">
              Astrotalk
            </p>
          </Link>

          <ul className="list-none hidden sm:flex flex-row gap-10 text-black">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${active === nav.title ? 'text-teal-400' : 'text-secondary'
                  } hover:text-teal-400 text-black text-[18px] font-medium cursor-pointer pt-1`}
                onClick={() => setActive(nav.title)}
              >
                <Link href={`/${nav.id}`}>
                  <p className="text-black">{nav.title}</p>
                </Link>
              </li>
            ))}
            <li>
              <div className="hover:text-teal-400 text-black text-[18px] font-medium cursor-pointer pt-1 ">
                {isAuthenticated && user ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    width={1000}
                    height={1000}
                    className="w-9 h-9 rounded-full object-cover mx-2"
                  />
                ) : (
                  <Link href="/login">
                    <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      Sign in
                    </button>
                  </Link>
                )}
              </div>
            </li>
          </ul>

          {/* -------------mobile devices-------------*/}
          <div className="sm:hidden flex flex-1 justify-end items-center">
            <Image
              width={25}
              height={25}
              src={toggle ? `https://cdn-icons-png.flaticon.com/512/5369/5369422.png` : 'https://cdn-icons-png.flaticon.com/512/10613/10613684.png'}
              alt="menu"
              className="w-[28px] h-[28px] cursor-pointer text-black"
              onClick={handleToggleClick}
            />

            {toggle && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black opacity-50 overscroll-none"
                onClick={handleMenuClose}
              ></div>
            )}

            <div
              className={`${!toggle ? 'hidden' : 'flex'
                } p-6 bg-gray-900 absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl animate-fadeIn`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? 'text-black' : 'text-black'
                      } animate-slideIn`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    <Link href={`/${nav.id}`}>
                      <p>{nav.title}</p>
                    </Link>
                  </li>
                ))}
                <li>
                  <div className="sm:flex flex-1 justify-end items-center">
                    {isAuthenticated && user ? (
                      <Image
                        src={user.avatar}
                        alt="Avatar"
                        width={1000}
                        height={1000}
                        className="w-8 h-8 rounded-full object-cover mx-2"
                      />
                    ) : (
                      <Link href="/login">
                        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                          Sign in
                        </button>
                      </Link>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

