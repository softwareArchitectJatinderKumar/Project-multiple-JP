import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Script from 'next/script';
import React from 'react';

export const metadata = {
  title: 'LPU -- E - Journals',
  description: "LPU Ranks 38th amongst all government private universities...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
       <head>
         <meta charSet="utf-8" />
         <base href="/" />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <script src="https://www.lpu.in/lpu-assets/js/jquery.js"></script>
         <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
         <title>LPU e-Journals </title>
         <meta name="description"
           content="LPU Ranks 38th amongst all government private universities in India, NIRF Rankings-2023. LPU offering best diploma, undergraduate, postgraduate and doctorate (Ph.D) courses in Management (BBA/MBA), Engineering (B.Tech/M.Tech), Pharma, Science, Agriculture, Fashion, Law, Journalism, Hotel Management and Computer Application (BCA/MCA)" />
         <meta name="keywords"
           content="Best Private University Punjab, top Private University India, Private University, top Private University Jalandhar, LPU, Lovely Professional University,top universities in India,best universities in India,top private universities in India ,India best university ,best university for MBA in India ,Best University in India ,top universities in Punjab ,best b tech university in India,UGC recognized university,India’  top university,lovely professional university." />
         <meta name="robots" content="index, follow, archive" />
         <meta name="author" content="Lovely Professional University" />
         <meta name="publisher" content="Lovely Professional University" />
         <meta name="distribution" content="global" />
         <link rel="alternate" hrefLang="en-in" href="https://www.lpu.in/cif/" />
         <link rel="canonical" href="https://www.lpu.in/cif/" />
         <meta property="og:title" content="Lovely Professional University is India's Best Private University" />
         <meta property="og:site_name" content="LPU" />
         <meta property="og:url" content="https://www.lpu.in" />
         <meta property="og:description"
           content="Lovely Professional University (LPU) ranks 38th amongst Universities in India by NIRF Ranking 2023. LPU Punjab offers programs for Undergraduate, Postgraduate, Research Scholars, PhD and working professionals via Regular, Distance, Online and welcomes international students. Admission open in LPU for 2024 batches. Apply online today at LPU." />
         <meta property="og:image" content="https://www.lpu.in/images/logo/logo-media.png" />
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css" />
         <link rel="preconnect" href="https://www.lpu.in" />
         <link rel="dns-prefetch" href="https://www.lpu.in" />
         <link rel="preconnect" href="http://www.lpu.in" />
         <link rel="dns-prefetch" href="http://www.lpu.in" />
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
         <link rel="preload"
           href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
           as="font" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/bootstrap.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/style.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/font-icons.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/animate.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/magnific-popup.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/custom.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/header.css" type="text/css" />
         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/slick/slick.css" type="text/css" />
         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css" />
         <script src="https://www.lpu.in/lpu-assets/js/plugins.js" rel="preload" ></script>
         <script src="https://www.lpu.in/lpu-assets/slick/slick.js" rel="preload"></script>
       </head>
      <body className="stretched">
        <Script src="https://www.lpu.in/lpu-assets/js/jquery.js" strategy="beforeInteractive" />
        
        <ThemeRegistry>
          <main style={{ minHeight: '70vh' }}>
            {children}
          </main>
        </ThemeRegistry>

        <Script src="https://www.lpu.in/lpu-assets/js/plugins.js" />
        <Script src="https://www.lpu.in/lpu-assets/slick/slick.js" />
      </body>
    </html>
  );
}

// // import Header from '@/components/common/Header';

// // import Footer from '@/components/common/Footer';
// // import { RemoteHeader } from '@/components/common/RemoteHeader';
// import './globals.css';
// import ThemeRegistry from '@/theme/ThemeRegistry';
// import Script from 'next/script';
// import React from 'react';
// // import { RemoteFooter } from '@/components/common/RemoteFooter';
// // import NavigationSwitcher from '@/components/CIF/NavigationSwitcher';

// export const metadata = {
//   title: 'LPU -- E - Journals ',
//   description: "LPU Ranks 38th amongst all government private universities...",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <base href="/" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />

//         <script src="https://www.lpu.in/lpu-assets/js/jquery.js"></script>
//         <meta httpEquiv="content-type" content="text/html; charset=utf-8" />

//         <title>LPU e-Journals </title>
//         <meta name="description"
//           content="LPU Ranks 38th amongst all government private universities in India, NIRF Rankings-2023. LPU offering best diploma, undergraduate, postgraduate and doctorate (Ph.D) courses in Management (BBA/MBA), Engineering (B.Tech/M.Tech), Pharma, Science, Agriculture, Fashion, Law, Journalism, Hotel Management and Computer Application (BCA/MCA)" />
//         <meta name="keywords"
//           content="Best Private University Punjab, top Private University India, Private University, top Private University Jalandhar, LPU, Lovely Professional University,top universities in India,best universities in India,top private universities in India ,India best university ,best university for MBA in India ,Best University in India ,top universities in Punjab ,best b tech university in India,UGC recognized university,India’  top university,lovely professional university." />
//         <meta name="robots" content="index, follow, archive" />
//         <meta name="author" content="Lovely Professional University" />
//         <meta name="publisher" content="Lovely Professional University" />
//         <meta name="distribution" content="global" />
//         <link rel="alternate" hrefLang="en-in" href="https://www.lpu.in/cif/" />
//         <link rel="canonical" href="https://www.lpu.in/cif/" />
//         <meta property="og:title" content="Lovely Professional University is India's Best Private University" />
//         <meta property="og:site_name" content="LPU" />
//         <meta property="og:url" content="https://www.lpu.in" />
//         <meta property="og:description"
//           content="Lovely Professional University (LPU) ranks 38th amongst Universities in India by NIRF Ranking 2023. LPU Punjab offers programs for Undergraduate, Postgraduate, Research Scholars, PhD and working professionals via Regular, Distance, Online and welcomes international students. Admission open in LPU for 2024 batches. Apply online today at LPU." />
//         <meta property="og:image" content="https://www.lpu.in/images/logo/logo-media.png" />
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css" />
//         <link rel="preconnect" href="https://www.lpu.in" />
//         <link rel="dns-prefetch" href="https://www.lpu.in" />
//         <link rel="preconnect" href="http://www.lpu.in" />
//         <link rel="dns-prefetch" href="http://www.lpu.in" />
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
//         <link rel="preload"
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
//           as="font" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/bootstrap.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/style.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/font-icons.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/animate.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/magnific-popup.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/custom.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/css/header.css" type="text/css" />
//         <link rel="stylesheet" href="https://www.lpu.in/lpu-assets/slick/slick.css" type="text/css" />
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css" />
//         <script src="https://www.lpu.in/lpu-assets/js/plugins.js" rel="preload" ></script>
//         <script src="https://www.lpu.in/lpu-assets/slick/slick.js" rel="preload"></script>

//       </head>

//       <body className="stretched ">
//         <Script src="https://www.lpu.in/lpu-assets/js/jquery.js" strategy="beforeInteractive" />


//         <ThemeRegistry>
//           {/* <Header /> */}
//           <main style={{ minHeight: '70vh' }}>
//             {children}
//           </main>
//         </ThemeRegistry>

//       </body>
//     </html>
//   );
// }


