// Central source of truth for 10X Daytime product imagery.
// Each slot has a light and dark variant for theme-aware rendering.

export type ThemedImage = { light: string; dark: string };

export const PRODUCT_IMAGES = {
  front: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905839/10x-Light-1_gmdi4n.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905132/10x-Dark-1_tshkyo.png',
  },
  frontHero: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905838/10x-Light-4_ztxqi4.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905132/10x-Dark-4_a1i7ph.png',
  },
  elevated: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905839/10x-Light-2_ty7atn.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905133/10x-Dark-2_okdq3d.png',
  },
  back: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905839/10x-Light-3_fgz6vv.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905131/10x-Dark-3_tdevz0.png',
  },
  top: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905838/10x-Light-5_npmzbg.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905129/10x-Dark-5_vxhihz.png',
  },
  right: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905837/10x-Light-7_sdsakr.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905129/10x-Dark-6_wmltdm.png',
  },
  detail: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905839/10x-Light-8_upseyi.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905838/10x-Dark-7_jgurha.png',
  },
  sachetAngle: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905838/10x-Light-9_qpt9ym.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905129/10x-Dark-8_q5mcmt.png',
  },
  sachetsFlat: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905836/10x-Light-12_iddlid.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905129/10x-Dark-9_rcoqqn.png',
  },
  backWide: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905836/10x-Light-11_hp0ilk.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905129/10x-Dark-10_ifhkxr.png',
  },
  sachetBrand: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905836/10x-Light-10_jhuxis.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905128/10x-Dark-11_hvwyvn.png',
  },
  sachetDetail: {
    light: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905836/10x-Light-12_iddlid.png',
    dark: 'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786905128/10x-Dark-12_urwric.png',
  },
} as const;
