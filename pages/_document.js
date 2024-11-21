import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>จองคอนโดออนไลน์ | บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)</title>
        <meta name="description" content="จองคอนโดออนไลน์กับ บริษัท เจ้าพระยามหานคร จำกัด (มหาชน) ง่าย สะดวก ปลอดภัย เลือกห้องที่ใช่ จ่ายสะดวก ติดตามสถานะได้ทุกขั้นตอน" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="จองคอนโด, จองคอนโดออนไลน์, CMC Group, เจ้าพระยามหานคร, คอนโดใหม่, คอนโดพร้อมอยู่" />
        <meta name="author" content="บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)" />
        
        {/* <!-- Open Graph Meta Tags (สำหรับ Facebook และ Social Media) --> */}
        <meta property="og:title" content="จองคอนโดออนไลน์ | บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)" />
        <meta property="og:description" content="จองคอนโดออนไลน์ง่ายๆ กับ CMC Group เลือกห้องที่ใช่ สะดวก ปลอดภัย พร้อมติดตามสถานะการจองได้ทุกขั้นตอน" />
        <meta property="og:image" content="https://online.cmc.co.th/images/og-image.jpg" />
        <meta property="og:url" content="https://online.cmc.co.th" />
        <meta property="og:type" content="website" />

        {/* <!-- Twitter Card (สำหรับการแชร์บน Twitter) --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="จองคอนโดออนไลน์ | บริษัท เจ้าพระยามหานคร จำกัด (มหาชน)" />
        <meta name="twitter:description" content="จองคอนโดออนไลน์ง่ายๆ กับ CMC Group เลือกห้องที่ใช่ สะดวก ปลอดภัย พร้อมติดตามสถานะการจองได้ทุกขั้นตอน" />
        <meta name="twitter:image" content="https://online.cmc.co.th/images/twitter-image.jpg" />
        <link rel="icon" href="/fav.png" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
