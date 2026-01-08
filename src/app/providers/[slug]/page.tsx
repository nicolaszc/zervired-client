import { notFound } from 'next/navigation'
import ProviderProfile from '@/components/providers/ProviderProfile'
import { getProviderBySlug } from '@/lib/providers'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params

  const provider = getProviderBySlug(slug)

  if (!provider) {
    notFound()
  }

  return <ProviderProfile provider={provider} />
}
