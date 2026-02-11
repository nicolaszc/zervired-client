export type GalleryEngine = {
  cols: number
  rows: number
  perSlide: number
  dense: boolean
  maxSlides: number
}

export function getGalleryEngine(
  count: number,
  isMobile: boolean
): GalleryEngine {
console.log(isMobile)
  // ===== MOBILE =====
  if (isMobile) {

    const tall = count > 12

    return {
      cols: 2,
      rows: tall ? 3 : 2,
      perSlide: tall ? 6 : 4,
      dense: tall,
      maxSlides: 4
    }
  }

  // ===== DESKTOP =====
  const dense = count > 12

  return {
    cols: dense ? 4 : 3,
    rows: 2,
    perSlide: dense ? 8 : 6,
    dense,
    maxSlides: 3
  }
}

export function chunkSlides<T>(
  items: T[],
  perSlide: number,
  maxSlides: number
) {


  const slides: T[][] = []

  for (let i = 0; i < items.length; i += perSlide) {
    slides.push(items.slice(i, i + perSlide))
  }

  return slides.slice(0, maxSlides)
}

export function getPackingLayout(count: number, capacity: number) {

    // ------- Base 6 rules -------

    if (count === 1) return { mode: 'single' }
    if (count === 2) return { mode: 'stack' }
    if (count === 3) return { mode: 'last-wide', cols: 2, rows: 2 }
    if (count === 4) return { mode: 'grid-2x2', cols: 2, rows: 2 }
   
    // ------- Base 6 rules -------
    if (capacity === 6) { 

        if (count === 5) return { mode: 'last-span' }

    }

    // ------- Dense base (8) -------
    if (capacity === 8) {

        if (count === 5)
        return { mode: 'dense-5', cols: 3, rows: 2 }

        if (count === 6)
        return { mode: 'dense-6', cols: 3, rows: 2 }

        if (count === 7)
        return { mode: 'dense-7', cols: 4, rows: 2 }

    }

    // fallback
    return { mode: 'default' }
}

