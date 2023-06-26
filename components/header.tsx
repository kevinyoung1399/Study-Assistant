export default function Header() {
  return (
    <header>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1"></div>
        <a
          href="https://github.com/kevinyoung1399"
          className="block rounded-lg py-2.5 text-base font-semibold leading-7 text-green-500"
        >
          by Kevin Young
        </a>
      </nav>
    </header>
  );
}
