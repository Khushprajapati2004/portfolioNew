import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Education from '@/components/Education'

export default function Home() {
  return (
    <article itemScope itemType="https://schema.org/Person">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
    </article>
  )
}
