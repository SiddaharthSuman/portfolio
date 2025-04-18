import Image from 'next/image';

import styles from './page2.module.scss';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          priority
          alt="Next.js logo"
          className={styles.logo}
          height={38}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/next.svg`}
          width={180}
        />
        <ol>
          <li>
            Get started by editing <code>app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              alt="Vercel logomark"
              className={styles.logo}
              height={20}
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/vercel.svg`}
              width={20}
            />
            Deploy now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            rel="noopener noreferrer"
            target="_blank"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            aria-hidden
            alt="File icon"
            height={16}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/file.svg`}
            width={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            aria-hidden
            alt="Window icon"
            height={16}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/window.svg`}
            width={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            aria-hidden
            alt="Globe icon"
            height={16}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/globe.svg`}
            width={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
