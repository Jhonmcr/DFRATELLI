import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Truck, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

const servicesList = [
  {
    icon: <Wrench className="w-10 h-10 text-amber-500" />,
    title: "Asesoría Técnica Especializada",
    description: "Nuestros expertos te guían en la selección de los mejores materiales y herramientas para tu proyecto específico, evitando compras innecesarias."
  },
  {
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    title: "Envíos a Nivel Nacional",
    description: "Contamos con una flota propia y alianzas logísticas para llevar tus pedidos pesados o al mayor directamente a la puerta de tu obra."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
    title: "Garantía de Fábrica",
    description: "Todos nuestros equipos eléctricos y maquinaria pesada cuentan con garantía directa de los fabricantes más reconocidos del mercado."
  },
  {
    icon: <Clock className="w-10 h-10 text-purple-500" />,
    title: "Atención 24/7 B2B",
    description: "Para nuestros clientes corporativos y contratistas, ofrecemos canales de atención prioritarios a cualquier hora del día."
  }
];

export default function Services() {
  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-[80vh] relative">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-20"
      >
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
          Lo Que Hacemos
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Más allá de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">vender herramientas</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          En DFRATELLI no solo somos una ferretería. Somos tu socio estratégico en la construcción, brindando soluciones integrales para que tu obra nunca se detenga.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {servicesList.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-glass border border-slate-700/50 hover:border-amber-500/50 rounded-2xl p-8 transition-all duration-300 group"
          >
            <div className="bg-slate-800/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-slate-700 group-hover:bg-slate-800 transition-colors">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 relative z-10">
          ¿Tienes un proyecto grande en mente?
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10 relative z-10">
           <div className="flex items-center gap-2 text-slate-300">
             <CheckCircle className="text-amber-500 w-5 h-5"/> Cotizaciones Especiales
           </div>
           <div className="flex items-center gap-2 text-slate-300">
             <CheckCircle className="text-amber-500 w-5 h-5"/> Líneas de Crédito B2B
           </div>
           <div className="flex items-center gap-2 text-slate-300">
             <CheckCircle className="text-amber-500 w-5 h-5"/> Gestor de Cuenta Dedicado
           </div>
        </div>

        <a 
          href="https://wa.me/584242334809?text=Hola,%20me%20interesa%20consultar%20sobre%20un%20proyecto%20o%20servicio%20especial." 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 px-10 rounded-full transition-all shadow-neon text-lg relative z-10"
        >
          Contáctanos Ahora 💬
        </a>
      </motion.div>
    </div>
  );
}
