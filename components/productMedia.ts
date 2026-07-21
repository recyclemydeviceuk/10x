// Central source of truth for 10X Daytime product imagery.
// All hosted on Cloudinary — referenced across the product page, collection,
// shop menu, cart, story and formulation.

export const PRODUCT_IMAGES = {
  /** Wide lifestyle banner for the home hero — can + sachet on a kitchen counter.
   *  Scene generatively extended on the left (b_gen_fill, g_east) so the product
   *  sits a little further right, clear of the headline. */
  heroBanner:
    'https://res.cloudinary.com/dyxxkrq8r/image/upload/c_pad,ar_1.9,g_east,b_gen_fill/v1780933051/Front_e0b9zv.png',
  /** Can + sachet, front-on — primary hero shot. */
  front: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930079/Front.jpg_iz6m8c.jpg',
  /** Single can on a bright kitchen counter — clean lifestyle product shot. */
  canSingle: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930081/52361_yfebgx.png',
  /** Can, back panel — Focus. Clarity. Naturally. */
  back: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930079/Back.jpg_mwcdlc.jpg',
  /** Can, left side. */
  left: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930093/Left.jpg_mpczqt.jpg',
  /** Can, right side — ingredients & nutrition panel. */
  right: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930086/Right.jpg_npjxj0.jpg',
  /** Can, top-down lid detail on a dark desk. */
  top: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930082/Top.jpg_wk8ydj.jpg',
  /** Pouring a sachet into a glass on an office table. */
  pourOffice: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930089/Life-style_mirjj1.png',
  /** Pouring a sachet into a glass — warm neutral backdrop. */
  pourBeige: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930093/Hands_1_tvxlol.png',
  /** Hand holding three sachets — green backdrop. */
  sachetsHeld: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930093/REALIFE-1_ikmclq.png',
  /** Three sachets laid flat. */
  sachetsFlat: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780930093/Real-Life_p6cylv.png',
} as const;
