import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Leaf,
  Users,
  Laptop,
  Recycle,
  Code,
  GraduationCap,
  Building,
  Wrench,
  Heart,
  MapPin,
  Gamepad2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-x-hidden">
      {/* Pixel grid pattern overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2a2a4e 1px, transparent 1px),
            linear-gradient(to bottom, #2a2a4e 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#ffd700]/50" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#ffd700]/50" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#ffd700]/50" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#ffd700]/50" />

        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-6 inline-block"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-20 h-20 mx-auto bg-[#0f0f1e] border-4 border-[#ffd700] flex items-center justify-center">
              <Shield className="w-10 h-10 text-[#ffd700]" />
            </div>
          </motion.div>

          <h1 className="font-retro text-2xl md:text-4xl lg:text-5xl mb-6 text-[#ffd700] tracking-wider">
            LE VILLAGE NUMÉRIQUE RÉSISTANT
          </h1>

          <p className="font-retro text-sm md:text-base text-[#f0f0f0] mb-4 tracking-wide">
            Comment les établissements scolaires peuvent tenir tête aux Big Tech ?
          </p>

          <p className="font-retro text-xs md:text-sm text-[#888] mb-12 italic">
            David contre Goliath, Astérix contre l'Empire numérique
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/game')}
              className="bg-[#ffd700] hover:bg-[#ffed4a] text-[#0f0f1e] font-retro text-sm md:text-base px-8 py-6 border-4 border-[#0f0f1e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
            >
              <Gamepad2 className="mr-3 w-5 h-5" />
              ENTRER DANS LE VILLAGE
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#ffd700] flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#ffd700]" />
          </div>
        </motion.div>
      </section>

      {/* What is NIRD Section */}
      <section className="py-24 px-4 bg-[#0f0f1e] relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#ffd700]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              QU'EST-CE QUE <span className="text-[#00ff00]">NIRD</span> ?
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Numérique Inclusif, Responsable et Durable
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Users,
                title: 'INCLUSION',
                description: 'Rendre le numérique accessible à tous, sans discrimination économique ou technique.',
                color: '#3b82f6'
              },
              {
                icon: Shield,
                title: 'RESPONSABILITÉ',
                description: 'Protéger les données, respecter la vie privée et garder le contrôle sur nos outils.',
                color: '#ef4444'
              },
              {
                icon: Leaf,
                title: 'DURABILITÉ',
                description: "Prolonger la vie du matériel, réduire l'empreinte carbone, adopter la sobriété numérique.",
                color: '#22c55e'
              }
            ].map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={fadeInUp}
                className="group"
              >
                <div className="bg-[#1a1a2e] border-4 border-[#4a4a6a] p-6 hover:border-[#ffd700] transition-all duration-300 h-full">
                  <div
                    className="w-14 h-14 border-4 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ borderColor: pillar.color }}
                  >
                    <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                  </div>
                  <h3 className="font-retro text-sm text-[#ffd700] mb-4">{pillar.title}</h3>
                  <p className="font-retro text-[10px] text-[#888] leading-relaxed">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="py-24 px-4 bg-[#1a1a2e] relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              LE <span className="text-[#ef4444]">DÉFI</span>
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Les écoles face aux géants du numérique
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Problems */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0f0f1e] border-4 border-[#ef4444] p-6"
            >
              <h3 className="font-retro text-sm text-[#ef4444] mb-6">LES PROBLÈMES</h3>
              <ul className="space-y-4">
                {[
                  'Matériel obsolète et coûteux à remplacer',
                  'Licences logicielles onéreuses',
                  "Données stockées hors de l'UE",
                  'Écosystèmes fermés et propriétaires',
                  'Dépendance aux Big Tech'
                ].map((problem, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="font-retro text-[#ef4444] text-xs">✗</span>
                    <span className="font-retro text-[10px] text-[#888]">{problem}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0f0f1e] border-4 border-[#22c55e] p-6"
            >
              <h3 className="font-retro text-sm text-[#22c55e] mb-6">LES SOLUTIONS NIRD</h3>
              <ul className="space-y-4">
                {[
                  { icon: Laptop, text: 'Adoption de Linux et logiciels libres' },
                  { icon: Recycle, text: 'Réemploi et reconditionnement du matériel' },
                  { icon: Code, text: 'Logiciels open source (LibreOffice, etc.)' },
                  { icon: Leaf, text: 'Sobriété numérique et éco-conception' },
                  { icon: Shield, text: 'Souveraineté des données en Europe' }
                ].map((solution, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <solution.icon className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                    <span className="font-retro text-[10px] text-[#888]">{solution.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who's Involved Section */}
      <section className="py-24 px-4 bg-[#0f0f1e] relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#ffd700]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              QUI <span className="text-[#3b82f6]">PARTICIPE</span> ?
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Tous les acteurs de l'écosystème éducatif
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: GraduationCap, label: 'Élèves & Éco-délégués' },
              { icon: Users, label: 'Enseignants' },
              { icon: Building, label: 'Administrations' },
              { icon: Wrench, label: 'Techniciens IT' },
              { icon: Heart, label: 'Associations' },
              { icon: MapPin, label: 'Collectivités' }
            ].map((actor) => (
              <motion.div
                key={actor.label}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1a2e] border-4 border-[#4a4a6a] flex items-center justify-center group-hover:border-[#ffd700] group-hover:scale-110 transition-all">
                  <actor.icon className="w-8 h-8 text-[#ffd700]" />
                </div>
                <p className="font-retro text-[8px] text-[#888]">{actor.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-[#1a1a2e] relative">
        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-[#0f0f1e] border-4 border-[#ffd700] p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(255,215,0,0.3)]">
            <h2 className="font-retro text-lg md:text-xl text-[#ffd700] mb-6 tracking-wider">
              PRÊT À REJOINDRE LA <span className="text-[#00ff00]">RÉSISTANCE</span> ?
            </h2>
            <p className="font-retro text-[10px] md:text-xs text-[#888] mb-10">
              Explorez notre village numérique et découvrez comment participer au mouvement NIRD !
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/game')}
                className="bg-[#ffd700] hover:bg-[#ffed4a] text-[#0f0f1e] font-retro text-sm md:text-base px-10 py-8 border-4 border-[#0f0f1e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
              >
                <Gamepad2 className="mr-3 w-6 h-6" />
                JOUER MAINTENANT
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0f0f1e] border-t-4 border-[#ffd700]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-retro text-xs text-[#ffd700] mb-2">
                LA NUIT DE L'INFO 2025
              </p>
              <p className="font-retro text-[8px] text-[#888]">
                Du jeudi 4 décembre 16h39 au vendredi 5 décembre 4h07
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://nird.forge.apps.education.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-retro text-[10px] text-[#888] hover:text-[#ffd700] transition-colors"
              >
                Site officiel NIRD
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-[#4a4a6a] text-center">
            <p className="font-retro text-[8px] text-[#888]">
              La Forge des Communs Numériques Éducatifs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
