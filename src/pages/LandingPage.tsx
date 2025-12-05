import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
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
  ExternalLink,
  Server,
  Database,
  FileText,
  Globe,
  Zap,
  TrendingDown,
  Euro,
  HardDrive,
  Cloud,
  Lock,
  CheckCircle,
  XCircle,
  Swords,
  Castle,
  Home,
  Store,
  TreePine
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

// Animated counter component
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Quiz component
function MiniQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = [
    {
      question: "Que signifie NIRD ?",
      answers: [
        "Numérique Innovant et Rapide Digital",
        "Numérique Inclusif, Responsable et Durable",
        "Nouveau Internet pour les Régions et Départements",
        "Network Infrastructure for Remote Development"
      ],
      correct: 1
    },
    {
      question: "Quel système d'exploitation libre peut remplacer Windows ?",
      answers: ["macOS", "Linux", "ChromeOS", "DOS"],
      correct: 1
    },
    {
      question: "Quelle alternative open source remplace Microsoft Office ?",
      answers: ["Google Docs", "LibreOffice", "Notepad", "Adobe Reader"],
      correct: 1
    },
    {
      question: "Qu'est-ce que la sobriété numérique ?",
      answers: [
        "Ne jamais utiliser d'ordinateur",
        "Réduire l'impact environnemental du numérique",
        "Utiliser uniquement des réseaux sociaux",
        "Acheter le dernier smartphone chaque année"
      ],
      correct: 1
    },
    {
      question: "Pourquoi est-il important de stocker les données en Europe ?",
      answers: [
        "C'est moins cher",
        "Les serveurs sont plus rapides",
        "Pour la souveraineté et la protection des données (RGPD)",
        "Pour avoir un meilleur design"
      ],
      correct: 2
    },
    {
      question: "Que signifie 'reconditionner' un ordinateur ?",
      answers: [
        "Le jeter à la poubelle",
        "Le remettre en état pour le réutiliser",
        "Le peindre en noir",
        "Acheter un nouveau modèle"
      ],
      correct: 1
    },
    {
      question: "Quel est l'avantage principal des logiciels open source ?",
      answers: [
        "Ils sont toujours payants",
        "Le code est secret et fermé",
        "Ils sont libres, gratuits et modifiables",
        "Ils ne fonctionnent que sur Mac"
      ],
      correct: 2
    },
    {
      question: "Quelle solution permet d'héberger ses fichiers de façon souveraine ?",
      answers: [
        "Google Drive",
        "Dropbox",
        "iCloud",
        "Nextcloud"
      ],
      correct: 3
    },
    {
      question: "Combien de tonnes de déchets électroniques sont produites par an dans le monde ?",
      answers: [
        "5 millions de tonnes",
        "53 millions de tonnes",
        "100 mille tonnes",
        "1 milliard de tonnes"
      ],
      correct: 1
    },
    {
      question: "Qu'est-ce que 'La Forge' dans le contexte NIRD ?",
      answers: [
        "Un jeu vidéo",
        "Une usine de métallurgie",
        "La plateforme des Communs Numériques Éducatifs",
        "Un restaurant"
      ],
      correct: 2
    },
    {
      question: "Quel navigateur respecte davantage la vie privée ?",
      answers: [
        "Google Chrome",
        "Microsoft Edge",
        "Firefox",
        "Internet Explorer"
      ],
      correct: 2
    },
    {
      question: "Quelle est la durée de vie moyenne d'un smartphone en France ?",
      answers: [
        "6 mois",
        "2-3 ans",
        "10 ans",
        "15 ans"
      ],
      correct: 1
    },
    {
      question: "Que permet de faire PeerTube ?",
      answers: [
        "Envoyer des emails",
        "Héberger des vidéos de façon décentralisée",
        "Créer des tableurs",
        "Jouer en ligne"
      ],
      correct: 1
    }
  ];

  // Shuffle and pick 5 random questions on component mount
  const [shuffledQuestions] = useState(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (index === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    const perfectScore = score === shuffledQuestions.length;
    const goodScore = score >= 4;
    const okScore = score >= 3;

    return (
      <div className="text-center">
        <div className="font-retro text-2xl text-[#ffd700] mb-4">
          {perfectScore ? 'PARFAIT !' : goodScore ? 'EXCELLENT !' : okScore ? 'BIEN JOUÉ !' : 'CONTINUE !'}
        </div>
        <p className="font-retro text-sm text-[#888] mb-2">
          Score: {score}/{shuffledQuestions.length}
        </p>
        <p className="font-retro text-[10px] text-[#888] mb-6">
          {perfectScore
            ? 'Tu es un vrai résistant numérique !'
            : goodScore
            ? 'Tu maîtrises bien les concepts NIRD !'
            : okScore
            ? 'Tu es sur la bonne voie !'
            : 'Explore le village pour en apprendre plus !'}
        </p>
        <Button
          onClick={resetQuiz}
          className="bg-[#ffd700] hover:bg-[#ffed4a] text-[#0f0f1e] font-retro text-xs px-4 py-2"
        >
          REJOUER
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="font-retro text-[10px] text-[#888] mb-4">
        QUESTION {currentQuestion + 1}/{shuffledQuestions.length}
      </div>
      <p className="font-retro text-sm text-[#f0f0f0] mb-6">
        {shuffledQuestions[currentQuestion].question}
      </p>
      <div className="space-y-3">
        {shuffledQuestions[currentQuestion].answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => selectedAnswer === null && handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-3 border-2 font-retro text-[10px] transition-all ${
              selectedAnswer === null
                ? 'border-[#4a4a6a] hover:border-[#ffd700] text-[#888]'
                : index === shuffledQuestions[currentQuestion].correct
                ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]'
                : index === selectedAnswer
                ? 'border-[#ef4444] bg-[#ef4444]/20 text-[#ef4444]'
                : 'border-[#4a4a6a] text-[#888]'
            }`}
          >
            {selectedAnswer !== null && index === shuffledQuestions[currentQuestion].correct && (
              <CheckCircle className="inline w-4 h-4 mr-2" />
            )}
            {selectedAnswer === index && index !== shuffledQuestions[currentQuestion].correct && (
              <XCircle className="inline w-4 h-4 mr-2" />
            )}
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

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

      {/* Animated Statistics Section */}
      <section className="py-20 px-4 bg-[#0f0f1e] relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#ffd700]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              POURQUOI <span className="text-[#ef4444]">RÉSISTER</span> ?
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Les chiffres qui font réfléchir
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Euro, value: 500, suffix: 'M€', label: 'dépensés en licences/an en France', color: '#ef4444' },
              { icon: HardDrive, value: 53, suffix: 'Mt', label: 'de déchets électroniques/an mondial', color: '#f59e0b' },
              { icon: Cloud, value: 90, suffix: '%', label: 'des données hors UE (GAFAM)', color: '#3b82f6' },
              { icon: TrendingDown, value: 70, suffix: '%', label: "d'économies avec le libre", color: '#22c55e' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a2e] border-4 border-[#4a4a6a] p-4 text-center hover:border-[#ffd700] transition-all group"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ color: stat.color }} />
                <div className="font-retro text-2xl md:text-3xl mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-retro text-[8px] text-[#888]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Village Map Section */}
      <section className="py-20 px-4 bg-[#1a1a2e] relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              NOTRE <span className="text-[#22c55e]">VILLAGE</span> NUMÉRIQUE
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Comme le village d'Astérix, nous résistons encore et toujours !
            </p>
          </motion.div>

          {/* Village Map */}
          <div className="relative bg-[#0f0f1e] border-4 border-[#ffd700] p-8 overflow-hidden">
            {/* Decorative trees */}
            <div className="absolute top-4 left-4 text-[#22c55e] opacity-30">
              <TreePine className="w-8 h-8" />
            </div>
            <div className="absolute top-4 right-4 text-[#22c55e] opacity-30">
              <TreePine className="w-8 h-8" />
            </div>
            <div className="absolute bottom-4 left-8 text-[#22c55e] opacity-30">
              <TreePine className="w-6 h-6" />
            </div>
            <div className="absolute bottom-4 right-8 text-[#22c55e] opacity-30">
              <TreePine className="w-6 h-6" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Castle,
                  name: "LA FORGE",
                  description: "Centre de formation aux logiciels libres",
                  color: '#ffd700'
                },
                {
                  icon: Home,
                  name: "L'ÉCOLE LIBRE",
                  description: "Établissements équipés en open source",
                  color: '#3b82f6'
                },
                {
                  icon: Store,
                  name: "LE RECYCLEUR",
                  description: "Atelier de reconditionnement du matériel",
                  color: '#22c55e'
                },
                {
                  icon: Server,
                  name: "LE DATACENTER",
                  description: "Hébergement souverain des données",
                  color: '#8b5cf6'
                },
                {
                  icon: Swords,
                  name: "L'ARÈNE",
                  description: "Défis et compétitions numériques",
                  color: '#ef4444'
                },
                {
                  icon: Globe,
                  name: "LA PLACE",
                  description: "Communauté et partage de ressources",
                  color: '#f59e0b'
                }
              ].map((building, index) => (
                <motion.div
                  key={building.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#1a1a2e] border-2 p-4 text-center cursor-pointer transition-all"
                  style={{ borderColor: building.color }}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-3 border-2 flex items-center justify-center"
                    style={{ borderColor: building.color }}
                  >
                    <building.icon className="w-6 h-6" style={{ color: building.color }} />
                  </div>
                  <h3 className="font-retro text-xs mb-2" style={{ color: building.color }}>
                    {building.name}
                  </h3>
                  <p className="font-retro text-[8px] text-[#888]">{building.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Arsenal Section */}
      <section className="py-20 px-4 bg-[#0f0f1e] relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#ffd700]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              L'ARSENAL <span className="text-[#8b5cf6]">OPEN SOURCE</span>
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Nos armes pour la résistance numérique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Laptop,
                name: 'Linux',
                type: 'Système',
                description: 'Ubuntu, Debian, Fedora...',
                replaces: 'Windows',
                color: '#f59e0b'
              },
              {
                icon: FileText,
                name: 'LibreOffice',
                type: 'Bureautique',
                description: 'Writer, Calc, Impress',
                replaces: 'MS Office',
                color: '#22c55e'
              },
              {
                icon: Globe,
                name: 'Firefox',
                type: 'Navigateur',
                description: 'Respectueux de la vie privée',
                replaces: 'Chrome',
                color: '#ef4444'
              },
              {
                icon: Database,
                name: 'Nextcloud',
                type: 'Cloud',
                description: 'Stockage souverain',
                replaces: 'Google Drive',
                color: '#3b82f6'
              },
              {
                icon: Code,
                name: 'GIMP',
                type: 'Image',
                description: 'Édition photo pro',
                replaces: 'Photoshop',
                color: '#8b5cf6'
              },
              {
                icon: Zap,
                name: 'Moodle',
                type: 'E-learning',
                description: 'Plateforme éducative',
                replaces: 'Classroom',
                color: '#f59e0b'
              },
              {
                icon: Lock,
                name: 'Bitwarden',
                type: 'Sécurité',
                description: 'Gestionnaire de mots de passe',
                replaces: 'LastPass',
                color: '#22c55e'
              },
              {
                icon: Server,
                name: 'PeerTube',
                type: 'Vidéo',
                description: 'Hébergement décentralisé',
                replaces: 'YouTube',
                color: '#ef4444'
              }
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a2e] border-2 border-[#4a4a6a] p-4 hover:border-[#ffd700] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 border-2 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ borderColor: tool.color }}
                  >
                    <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-retro text-xs text-[#ffd700]">{tool.name}</h3>
                      <span className="font-retro text-[6px] px-1 bg-[#4a4a6a] text-[#888]">{tool.type}</span>
                    </div>
                    <p className="font-retro text-[8px] text-[#888] mb-1">{tool.description}</p>
                    <p className="font-retro text-[7px] text-[#ef4444]">
                      Remplace: {tool.replaces}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section className="py-20 px-4 bg-[#1a1a2e] relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-retro text-xl md:text-2xl text-[#ffd700] mb-4 tracking-wider">
              TESTEZ VOS <span className="text-[#3b82f6]">CONNAISSANCES</span>
            </h2>
            <p className="font-retro text-xs md:text-sm text-[#888]">
              Êtes-vous prêt pour la résistance numérique ?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0f0f1e] border-4 border-[#ffd700] p-6"
          >
            <MiniQuiz />
          </motion.div>
        </div>
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
