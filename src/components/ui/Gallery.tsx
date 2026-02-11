'use client'

import Image from 'next/image'
import type { MediaItem } from '@/interfaces/media'
import { getPackingLayout } from '@/lib/galleryEngine'
import useIsMobile from '@/hooks/useIsMobile'

interface Props {
  slides: MediaItem[][]
  cols: number
  rows: number
}

export default function Gallery({
  slides,
  cols,
  rows,
}: Props) {

        const isMobile = useIsMobile()

    function getTileClass(mode: string, index: number) {
        // Mobile grid layouts need fixed ratio to avoid grid collapse
        // Packed layouts must remain aspect-auto for span growth
        switch (mode) {

            case 'single':
                return 'col-span-full row-span-full aspect-auto'

            case 'stack':
                return 'col-span-full aspect-auto'

            case 'last-wide':
                return index === 2
                    ? 'col-span-2 aspect-auto'
                    : 'aspect-auto'

            case 'grid-2x2':
                return isMobile
                ?'aspect-4/3' 
                :'aspect-auto' 

            case 'last-span':
                return index === 4
                    ? 'col-span-2'
                    : 'aspect-4/3'   
            
            case 'dense-5':
                return index === 4
                    ? 'col-span-2 aspect-auto'
                    : 'aspect-auto'

            case 'dense-7':
                return index === 6
                    ? 'col-span-2'
                    : 'aspect-4/3'

            default:
            return 'aspect-4/3'
        }
    }


  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">

      {slides.map((slide, slideIndex) => {

  const layout = getPackingLayout(slide.length, cols * rows)



  console.log(layout.mode)
  
const gridCols = layout.cols ?? cols
const gridRows = layout.rows ?? rows
  return (

    <div
      key={slideIndex}
      className="snap-start shrink-0 w-[82%] md:w-full"
    >

      <div
  className="grid h-full"
  style={{
    gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
    gridTemplateRows: `repeat(${gridRows}, 1fr)`
  }}
>
        {slide.map((item, index) => (

          <div
  key={index}
  className={`relative blend  ${getTileClass(layout.mode, index)}`}
>
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>

        ))}
      </div>

    </div>

  )
})}
</div>
  )
}
