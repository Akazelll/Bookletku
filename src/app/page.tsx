import React from "react";
import {
  Zap,
  MessageSquare,
  Users,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  BarChart3,
  QrCode, // Ikon untuk QR Code
  Smartphone, // Ikon untuk Order via WhatsApp
  Store, // Ikon untuk Manajemen Toko
  Utensils, // Ikon untuk Logo Bookletku
  CheckCircle2, // Ikon untuk Hemat Biaya
} from "lucide-react";

// --- Utility Components (Simplified for Single-File Use) ---

// Button: gunakan tipe props eksplisit untuk menghindari implicit any
const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  [key: string]: any;
}) => {
  let baseStyle =
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";

  if (variant === "primary") {
    baseStyle +=
      " bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30";
  } else if (variant === "outline") {
    baseStyle +=
      " bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600";
  } else if (variant === "ghost") {
    baseStyle +=
      " text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700";
  }

  if (size === "lg") {
    baseStyle += " px-8 py-3 text-lg h-12";
  } else if (size === "md") {
    baseStyle += " px-6 py-2 h-10";
  } else if (size === "sm") {
    baseStyle += " px-4 py-1.5 h-8 text-sm";
  }

  // Handle CTA section button style specifically
  if (className.includes("cta-button-white")) {
    baseStyle =
      "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 h-14 px-8 text-lg bg-white text-orange-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white";
  }

  // Destructure 'href' dan 'onClick' karena Link/<a> luar menangani navigasi
  const { href, onClick, ...restProps } = props;

  return (
    // Menggunakan <span> agar aman ketika berada di dalam <a>
    // FIX: Menambahkan backticks (`) di sekitar string template
    <span {...restProps} className={`${baseStyle} ${className}`}>
      {children}
    </span>
  );
};

// Placeholder components based on the incoming code's structure
const Link = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  // Ini adalah <a> terluar yang menangani navigasi
  <a href={href} className={className}>
    {children}
  </a>
);

const Card = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    // FIX: Menambahkan backticks
    className={`rounded-xl bg-white shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  // FIX: Menambahkan backticks
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <h3
    // FIX: Menambahkan backticks
    className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  // FIX: Menambahkan backticks
  <div className={`p-6 ${className}`}>{children}</div>
);

const Badge = ({
  children,
  className = "",
  variant = "default",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
}) => {
  let style =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  if (variant === "primary") {
    style +=
      " bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200";
  } else if (variant === "secondary") {
    style += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  } else {
    style += " bg-gray-500 text-white";
  }
  // FIX: Menambahkan backticks
  return <span className={`${style} ${className}`}>{children}</span>;
};

// --- Main App Component ---

const FeatureCard = ({
  Icon,
  title,
  description,
  colorClass,
  iconColor,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description: React.ReactNode;
  colorClass?: string;
  iconColor?: string;
}) => (
  <Card className='text-left p-6 transition-shadow duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700'>
    <div
      // FIX: Menambahkan backticks
      className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mb-4`}
    >
      {/* FIX: Menambahkan backticks */}
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <h4 className='font-bold text-lg mb-2 text-gray-900 dark:text-white'>
      {title}
    </h4>
    <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
  </Card>
);

const StepItem = ({
  number,
  title,
  active,
}: {
  number: React.ReactNode;
  title: React.ReactNode;
  active?: boolean;
}) => (
  <li className='flex items-center space-x-4'>
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
        active
          ? "bg-orange-500 text-white"
          : "bg-white text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      }`}
    >
      {number}
    </div>
    <span
      className={`text-lg ${
        active
          ? "text-gray-900 dark:text-white font-semibold"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {title}
    </span>
  </li>
);

const TestimonialCard = ({
  name,
  role,
  text,
}: {
  name: string;
  role?: string;
  text: React.ReactNode;
}) => (
  <Card className='p-6 h-full flex flex-col justify-between hover:shadow-xl transition-shadow duration-300'>
    <div>
      <div className='flex text-orange-400 mb-3'>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className='w-4 h-4 fill-orange-400' />
        ))}
      </div>
      <p className='text-gray-700 dark:text-gray-300 text-base mb-4 line-clamp-4'>
        {text}
      </p>
    </div>
    <div className='pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center'>
      <div className='w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden'>
        <div className='w-full h-full bg-gray-300 flex items-center justify-center text-gray-600'>
          <Users className='w-5 h-5' />
        </div>
      </div>
      <div>
        <div className='font-semibold text-gray-900 dark:text-white'>
          {name}
        </div>
        <div className='text-sm text-gray-500 dark:text-gray-400'>{role}</div>
      </div>
    </div>
  </Card>
);

// Illustration mockups simulating the 3D style for Bookletku
const HeroIllustration = () => (
  <div className='relative w-full max-w-lg h-96 mx-auto'>
    {/* Mockup Ponsel Menampilkan Menu */}
    <div className='absolute bottom-8 right-1/4 translate-x-1/4 w-52 h-96 bg-gray-800 rounded-[2.5rem] border-8 border-gray-900 shadow-2xl transform rotate-6'>
      {/* Layar Menu */}
      <div className='h-full w-full p-2 overflow-hidden'>
        <div className='h-4 bg-orange-500 rounded-lg mb-4'></div>{" "}
        {/* Header Menu */}
        <div className='space-y-3'>
          <div className='h-24 bg-white rounded-xl shadow-sm'></div>
          <div className='h-24 bg-white rounded-xl shadow-sm'></div>
          <div className='h-24 bg-white rounded-xl shadow-sm'></div>
        </div>
      </div>
    </div>

    {/* QR Code di Meja */}
    <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-xl border border-gray-200 shadow-xl flex items-center justify-center transform rotate-[-10deg]'>
      <QrCode className='w-16 h-16 text-gray-700' />
    </div>

    {/* Floating elements */}
    <div className='absolute top-1/2 left-0 w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-md'>
      <Utensils className='w-6 h-6 text-orange-500' />
    </div>
  </div>
);

const SolutionsIllustration = () => (
  <div className='relative w-full max-w-sm h-72 mx-auto'>
    {/* Ilustrasi Pelanggan Memesan via WA */}
    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-green-400 rounded-[50%] blur-sm opacity-60'></div>
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-16 bg-green-500 rounded-[50%] shadow-xl shadow-green-500/40'></div>

    <div className='absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-white rounded-xl shadow-2xl border border-gray-200 flex items-center justify-center'>
      <MessageSquare className='w-12 h-12 text-green-500' />
    </div>

    {/* Floating icons */}
    <div className='absolute top-0 right-0 w-12 h-12 bg-orange-400 rounded-full shadow-lg flex items-center justify-center'>
      <Smartphone className='w-6 h-6 text-white' />
    </div>
    <div className='absolute bottom-20 left-4 w-8 h-8 bg-blue-400 rounded-full shadow-md'></div>
  </div>
);

const AgencyIllustration = () => (
  <div className='relative w-full max-w-sm h-72 mx-auto'>
    {/* Dashboard Admin Mockup */}
    <div className='absolute bottom-0 left-0 w-full h-1/4 bg-gray-200 dark:bg-gray-700 rounded-t-lg'></div>{" "}
    {/* Meja */}
    <div className='absolute bottom-1/4 left-1/2 -translate-x-full w-24 h-16 bg-gray-800 dark:bg-gray-900 rounded-t-lg shadow-xl'></div>{" "}
    {/* Monitor Stok */}
    <div className='absolute bottom-1/4 left-1/2 w-24 h-16 bg-gray-800 dark:bg-gray-900 rounded-t-lg shadow-xl'></div>{" "}
    {/* Monitor Analitik */}
    {/* Data Screens */}
    <div className='absolute top-8 left-1/4 w-16 h-10 bg-red-500 rounded-md flex items-center justify-center text-white text-xs font-bold'>
      <Zap className='w-3 h-3 mr-1' /> STOK
    </div>
    <div className='absolute top-4 right-1/4 w-16 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold'>
      <BarChart3 className='w-3 h-3 mr-1' /> OMSET
    </div>
    {/* Person working */}
    <div className='absolute bottom-1/4 right-1/4 translate-x-1/2 w-12 h-16 bg-orange-500 rounded-t-full'></div>
  </div>
);

export default function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200'>
      {/* --- NAVBAR --- */}
      <nav className='sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'>
        <div className='container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between max-w-7xl'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm'>
              <Utensils className='w-4 h-4' />
            </div>
            <span className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Bookletku
            </span>
          </div>
          {/* Menu Links */}
          <div className='hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400'>
            {["Home", "Fitur", "Demo", "Harga", "Kontak"].map((item) => (
              <a
                key={item}
                // FIX: Menambahkan backticks
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className='hover:text-orange-500 transition-colors'
              >
                {item}
              </a>
            ))}
          </div>
          {/* Sign Up Button */}
          <Link href='/login'>
            <Button size='sm' className='hidden sm:flex px-6'>
              Masuk
            </Button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section
        id='home'
        className='relative pt-20 pb-20 lg:pt-24 lg:pb-32 overflow-hidden'
      >
        {/* Background Grid and Blur */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[30px_30px] opacity-40 -z-10'></div>
        <div className='absolute left-1/4 top-1/4 -z-10 m-auto h-[350px] w-[350px] rounded-full bg-orange-300 opacity-20 blur-[150px]'></div>

        <div className='container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12 max-w-7xl'>
          {/* Text Content (Left) */}
          <div className='lg:w-1/2 text-center lg:text-left'>
            <Badge variant='primary' className='mb-4'>
              ✨ Solusi Digital No. #1 untuk Kuliner
            </Badge>
            <h1 className='text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight'>
              Buat Menu Digital <span className='text-orange-500'>QR Code</span>{" "}
              Instan
            </h1>
            <p className='text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-xl lg:max-w-none'>
              Tingkatkan omset restoran Anda. Pelanggan cukup scan, pilih menu,
              dan pesan langsung via WhatsApp tanpa perlu aplikasi.
            </p>
            <div className='flex justify-center lg:justify-start gap-4'>
              <Link href='/register'>
                <Button size='md'>Coba Gratis Sekarang</Button>
              </Link>
              <Link href='#demo'>
                <Button
                  size='md'
                  variant='outline'
                  className='text-gray-700 dark:text-gray-300 hover:text-orange-500'
                >
                  <QrCode className='w-4 h-4 mr-2' /> Lihat Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Illustration (Right) */}
          <div className='lg:w-1/2 flex justify-center'>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION (FITUR) --- */}
      <section id='fitur' className='py-20 lg:py-28 bg-white dark:bg-gray-800'>
        <div className='container mx-auto px-4 lg:px-8 text-center max-w-7xl'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3'>
            Fitur Utama Bookletku
          </h2>
          <p className='text-gray-500 dark:text-gray-400 mb-16 max-w-2xl mx-auto'>
            Kami merancang sistem yang mudah digunakan untuk pemilik bisnis dan
            nyaman bagi pelanggan.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            <FeatureCard
              Icon={QrCode}
              title='QR Code Instan'
              description='Generate QR Code otomatis untuk setiap meja. Pelanggan tinggal scan tanpa perlu install aplikasi tambahan.'
              colorClass='bg-red-500/20'
              iconColor='text-red-500'
            />
            <FeatureCard
              Icon={Smartphone}
              title='Order via WhatsApp'
              description='Pesanan pelanggan otomatis terformat rapi dan dikirim langsung ke WhatsApp Kasir/Dapur Anda.'
              colorClass='bg-green-500/20'
              iconColor='text-green-500'
            />
            <FeatureCard
              Icon={Store}
              title='Manajemen Mudah'
              description='Ubah harga, tambah menu baru, atau matikan stok kosong secara real-time dari dashboard admin.'
              colorClass='bg-purple-500/20'
              iconColor='text-purple-500'
            />
            <FeatureCard
              Icon={CheckCircle2}
              title='Hemat Biaya'
              description='Tidak perlu cetak ulang buku menu fisik setiap ganti harga atau stok habis. Ramah lingkungan dan hemat biaya.'
              colorClass='bg-orange-500/20'
              iconColor='text-orange-500'
            />
          </div>
        </div>
      </section>

      {/* --- SIMPLE SOLUTIONS (ALUR PESANAN) --- */}
      <section className='relative py-20 lg:py-28 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4 lg:px-8 max-w-7xl'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            {/* Illustration (Left) */}
            <div className='lg:w-1/2 flex justify-center order-first lg:order-first'>
              <SolutionsIllustration />
            </div>

            {/* Steps Content (Right) */}
            <div className='lg:w-1/2 lg:text-left text-center'>
              <h2 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4'>
                Alur Pemesanan 3 Langkah
              </h2>
              <p className='text-gray-500 dark:text-gray-400 mb-8 text-lg'>
                Pengalaman pemesanan yang cepat dan tanpa hambatan untuk
                meningkatkan kepuasan pelanggan.
              </p>

              <ul className='space-y-6 text-left inline-block lg:inline'>
                <StepItem number={1} title='Scan QR Code' active={true} />
                <StepItem
                  number={2}
                  title='Pilih & Atur Pesanan'
                  active={false}
                />
                <StepItem
                  number={3}
                  title='Pesan via WhatsApp'
                  active={false}
                />
                <StepItem number={4} title='Nikmati Hidangan!' active={false} />
              </ul>

              <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link href='/register'>
                  <Button size='md'>Daftar Sekarang</Button>
                </Link>
                <Link href='#fitur'>
                  <Button size='md' variant='outline'>
                    Lihat Fitur Lengkap
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR AGENCY (Analytics) SECTION --- */}
      <section
        id='demo'
        className='relative py-20 lg:py-28 bg-white dark:bg-gray-800'
      >
        <div className='container mx-auto px-4 lg:px-8 max-w-7xl'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            {/* Text Content (Left) */}
            <div className='lg:w-1/2 text-center lg:text-left order-last lg:order-first'>
              <h2 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-6'>
                Dashboard Pemilik Toko
              </h2>
              <p className='text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl'>
                Pantau performa menu Anda. Lihat menu terpopuler, total
                tampilan, dan atur ketersediaan stok secara real-time hanya dari
                satu dashboard.
              </p>
              <Link href='/login'>
                <Button size='md'>Lihat Contoh Dashboard</Button>
              </Link>
            </div>

            {/* Illustration (Right) */}
            <div className='lg:w-1/2 flex justify-center lg:justify-end order-first lg:order-last'>
              <AgencyIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className='py-20 lg:py-28 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4 lg:px-8 max-w-7xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-10'>
            Kata Mereka yang Sudah Bergabung
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <TestimonialCard
              name='Budi Setiawan'
              role='Pemilik, Kopi Senja'
              text='Bookletku sangat membantu saat jam sibuk. Customer tidak perlu antri, dan pesanan langsung masuk ke dapur via WA dengan rapi. Omset naik 20%!'
            />
            <TestimonialCard
              name='Rina Dewi'
              role='Manajer, Warung Sambal Ijo'
              text='Sistemnya super cepat diakses HP jadul sekalipun. Update menu dan harga kini bisa dilakukan kapan saja tanpa repot cetak menu lagi. Hemat banget!'
            />
            <TestimonialCard
              name='Taufik H.'
              role='Owner, Burger Nendang'
              text='Fitur stoknya sangat krusial. Begitu item habis, otomatis nonaktif di menu pelanggan. Tidak ada lagi drama pesanan yang dibatalkan karena stok kosong.'
            />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section id='harga' className='py-20 lg:py-28'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='relative rounded-3xl bg-orange-500 overflow-hidden px-6 py-20 text-center shadow-2xl shadow-orange-500/30'>
            <div className='relative z-10 max-w-3xl mx-auto'>
              <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight'>
                Siap Digitalisasi Restoran Anda?
              </h2>
              <p className='text-orange-100 text-lg mb-10'>
                Bergabung dengan ratusan pemilik bisnis kuliner lainnya. Daftar
                sekarang, GRATIS selamanya untuk fitur dasar.
              </p>
              <Link href='/register'>
                <Button size='lg' className='cta-button-white'>
                  Mulai Gratis Sekarang!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pt-16 pb-8' id="kontak">
        <div className='container mx-auto px-4 lg:px-8 max-w-7xl'>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-8 mb-12'>
            {/* Logo and Tagline */}
            <div className='col-span-2'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold'>
                  <Utensils className='w-4 h-4' />
                </div>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                  Bookletku
                </span>
              </div>
              <p className='text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed text-sm mb-4'>
                Platform menu digital QR Code terbaik untuk UMKM, Cafe, dan
                Restoran di Indonesia.
              </p>
              {/* Social Icons */}
              <div className='flex gap-3'>
                <a
                  href='#'
                  className='text-gray-400 hover:text-orange-500 transition-colors'
                >
                  <Facebook className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-orange-500 transition-colors'
                >
                  <Twitter className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-orange-500 transition-colors'
                >
                  <Instagram className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-gray-400 hover:text-orange-500 transition-colors'
                >
                  <Linkedin className='w-5 h-5' />
                </a>
              </div>
            </div>

            {/* Links */}
            <div className='text-sm space-y-3'>
              <h4 className='font-bold text-gray-900 dark:text-white mb-4'>
                Produk
              </h4>
              <a
                href='#fitur'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Fitur
              </a>
              <a
                href='#demo'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Demo
              </a>
              <a
                href='#harga'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Harga
              </a>
            </div>

            <div className='text-sm space-y-3'>
              <h4 className='font-bold text-gray-900 dark:text-white mb-4'>
                Perusahaan
              </h4>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Tentang Kami
              </a>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Kontak
              </a>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Syarat & Ketentuan
              </a>
            </div>

            <div className='text-sm space-y-3'>
              <h4 className='font-bold text-gray-900 dark:text-white mb-4'>
                Sumber Daya
              </h4>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Blog
              </a>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Tutorial
              </a>
              <a
                href='#'
                className='block text-gray-600 dark:text-gray-400 hover:text-orange-500'
              >
                Bantuan
              </a>
            </div>
          </div>

          <div className='border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
            <p>&copy; {currentYear} Bookletku. Semua hak dilindungi.</p>
            <p className='text-xs'>Dibuat dengan ❤ di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
