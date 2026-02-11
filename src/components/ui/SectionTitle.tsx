interface Props {
  title?: React.ReactNode
  className?: string
}
export default function SectionTitle({ className, title }: Props){
    return(      
            <h2 className={`w-full md:w-auto bg-s-fade ${className}`}>
                <span className='section-title'>{title}</span>
            </h2>       
    )
}