interface Props {
  title?: React.ReactNode
  className?: string
}
export default function SectionTitle({ className, title }: Props){
    return(      
            <h2 className={`w-full md:w-auto ${className}`}>
                <span className='section-title bg-s-fade'>{title}</span>
            </h2>       
    )
}