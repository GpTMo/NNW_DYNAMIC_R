import React, { useState, useEffect, useRef } from 'react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const Booking: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Consultation & Création sur mesure',
    message: '',
  });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const validateForm = () => {
    let tempErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Le nom est requis.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'L\'adresse e-mail est requise.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Le format de l\'e-mail est invalide.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStatus('loading');
      // Simulate API call
      setTimeout(() => {
        setStatus('success');
      }, 2000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      service: 'Consultation & Création sur mesure',
      message: '',
    });
    setErrors({ name: '', email: '' });
    setStatus('idle');
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  if (status === 'success') {
    return (
       <section ref={sectionRef} className={`py-20 md:py-32 transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
        <div className="container mx-auto px-6 text-center">
           <div 
              className="max-w-2xl mx-auto bg-black/20 p-8 md:p-12 rounded-lg border border-[#C6905D]/20 animate-fade-in"
              aria-live="polite"
              role="alert"
            >
             <h3 className="font-heading text-3xl text-[#C6905D] mb-4">Merci !</h3>
             <p className="text-[#F5EBE0]/80 mb-6">Votre demande de rendez-vous a bien été envoyée. Nous vous contacterons très prochainement.</p>
             <button 
                onClick={resetForm}
                className="px-8 py-2 text-sm text-[#F5EBE0] border border-[#F5EBE0]/50 rounded-full hover:bg-[#F5EBE0]/10 transition-colors"
              >
                Faire une autre demande
              </button>
           </div>
        </div>
       </section>
    );
  }

  return (
    <section ref={sectionRef} className={`py-20 md:py-32 transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Prenez Rendez-vous
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Réservez votre consultation personnalisée et entrez dans l'univers NL.WIGS.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-black/20 p-8 md:p-12 rounded-lg border border-[#C6905D]/20">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F5EBE0]/70 mb-2">Nom complet</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className={`w-full bg-black/30 border text-white rounded-md p-3 focus:ring-[#C6905D] focus:border-[#C6905D] transition ${errors.name ? 'border-red-500/50' : 'border-[#C6905D]/30'}`} required aria-invalid={!!errors.name} aria-describedby="name-error" />
                {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F5EBE0]/70 mb-2">Adresse e-mail</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className={`w-full bg-black/30 border text-white rounded-md p-3 focus:ring-[#C6905D] focus:border-[#C6905D] transition ${errors.email ? 'border-red-500/50' : 'border-[#C6905D]/30'}`} required aria-invalid={!!errors.email} aria-describedby="email-error" />
                {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-[#F5EBE0]/70 mb-2">Service souhaité</label>
              <select id="service" value={formData.service} onChange={handleChange} className="w-full bg-black/30 border-[#C6905D]/30 text-white rounded-md p-3 focus:ring-[#C6905D] focus:border-[#C6905D] transition">
                <option>Consultation & Création sur mesure</option>
                <option>Réparation & Entretien</option>
                <option>Achat d'une création existante</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#F5EBE0]/70 mb-2">Votre message (optionnel)</label>
              <textarea id="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-black/30 border-[#C6905D]/30 text-white rounded-md p-3 focus:ring-[#C6905D] focus:border-[#C6905D] transition"></textarea>
            </div>
            <div className="text-center pt-4 space-y-6">
               <button 
                type="submit" 
                className="w-full md:w-auto px-10 py-3 text-base uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                disabled={status === 'loading'}
              >
                {status === 'loading' && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {status === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}
              </button>
              {status === 'error' && <p className="text-red-500 text-sm" role="alert">Une erreur s'est produite. Veuillez réessayer.</p>}
               <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-[#C6905D]/20"></div>
                  <span className="relative bg-black/20 px-4 text-sm text-[#F5EBE0]/50">Ou</span>
               </div>
               <button type="button" className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 text-base font-medium bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                 Se connecter avec Google
               </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;