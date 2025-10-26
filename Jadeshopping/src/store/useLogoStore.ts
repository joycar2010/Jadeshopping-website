import { create } from 'zustand';

interface LogoState {
  headerLogoSrc: string;
  footerLogoSrc: string;
  setHeaderLogo: (src: string) => void;
  setFooterLogo: (src: string) => void;
  swapLogos: () => void;
}

const getDefaultHeader = () => {
  try {
    return localStorage.getItem('customLogo') || '/guaranteed-antiques-logo.png';
  } catch {
    return '/guaranteed-antiques-logo.png';
  }
};

const getDefaultFooter = () => {
  try {
    return localStorage.getItem('footerCustomLogo') || '/guaranteed-antiques-logo.png';
  } catch {
    return '/guaranteed-antiques-logo.png';
  }
};

export const useLogoStore = create<LogoState>((set, get) => ({
  headerLogoSrc: getDefaultHeader(),
  footerLogoSrc: getDefaultFooter(),
  setHeaderLogo: (src: string) => {
    set({ headerLogoSrc: src });
    try { localStorage.setItem('customLogo', src); } catch {}
  },
  setFooterLogo: (src: string) => {
    set({ footerLogoSrc: src });
    try { localStorage.setItem('footerCustomLogo', src); } catch {}
  },
  swapLogos: () => {
    const { headerLogoSrc, footerLogoSrc } = get();
    set({ headerLogoSrc: footerLogoSrc, footerLogoSrc: headerLogoSrc });
    try {
      localStorage.setItem('customLogo', footerLogoSrc);
      localStorage.setItem('footerCustomLogo', headerLogoSrc);
    } catch {}
  }
}));