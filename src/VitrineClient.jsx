import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
// AJOUT DE updateDoc et doc DANS LES IMPORTS
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { MessageCircle, X, Truck, MapPin, User, Phone, Star, Minus, Plus, Loader2, Heart, ArrowRight, Package, Headphones, Instagram, CheckCircle } from 'lucide-react';

export default function VitrineClient() {
  const [produitsStock, setProduitsStock] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nom: '', tel: '', lieu: '', couleur: 'Marron' });
  // NOUVEL ETAT POUR LA NOTIFICATION
  const [showSuccess, setShowSuccess] = useState(false);

  const WHATSAPP_NUMBER = "237691154011";

  useEffect(() => {
    const q = query(collection(db, "peluches"), where("stock", ">", 0));
    const unsubscribe = onSnapshot(q, (snap) => {
      setProduitsStock(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const catalogueFixe = [
    { id: 'p1', cat: 'PREMIUM', taille: 80, prixAffiche: 15000, desc: "Finition artisanale & douceur absolue." },
    { id: 'p2', cat: 'PREMIUM', taille: 100, prixAffiche: 25000, desc: "L'excellence pour un souvenir éternel." },
    { id: 's1', cat: 'STANDARD', taille: 80, prixAffiche: 10000, desc: "Le compagnon idéal au quotidien." },
    { id: 's2', cat: 'STANDARD', taille: 100, prixAffiche: 20000, desc: "Une taille parfaite pour les câlins." },
    { id: 's3', cat: 'STANDARD', taille: 140, prixAffiche: 40000, desc: "L'impact géant qui surprendra tout le monde." }
  ];

  const avisClients = [
    { id: 1, nom: "Flörë Ta Quëën Dïvã", text: "Joyeux Noël à vous mes bb", img: "/images/avis1.jpeg", badge: "Joyeux Noël 🎄 à vous mes bb" },
    { id: 2, nom: "Cliente Heureuse", text: "Mon nounours rouge 140cm est magnifique !", img: "/images/avis2.jpeg" },
    { id: 3, nom: "Satisfaction client", text: "J'adore ma peluche rose ! Merci Peluche Store", img: "/images/avis3.jpeg" }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const enregistrerEtCommander = async () => {
    if(!formData.nom || !formData.tel || !formData.lieu) {
      alert("Veuillez remplir les informations de livraison.");
      return;
    }
    
    const pelucheBD = produitsStock.find(p => 
      p.categorie === selectedSize.cat && 
      Number(p.taille) === Number(selectedSize.taille) &&
      p.couleur === formData.couleur
    );
    
    if(!pelucheBD) {
      alert("Ce modèle n'est plus disponible dans cette couleur.");
      return;
    }

    if (pelucheBD.stock < quantite) {
      alert(`Désolé, il ne reste que ${pelucheBD.stock} articles en stock.`);
      return;
    }

    setIsSubmitting(true);
    const prixTotalCalcule = Number(pelucheBD.prix_vente) * quantite;

    try {
      await addDoc(collection(db, "commandes"), {
        client: formData.nom,
        tel: formData.tel,
        lieu: formData.lieu,
        date: new Date().toLocaleString('fr-FR'),
        timestamp: serverTimestamp(),
        nomArticle: `${selectedSize.taille} ${formData.couleur} ${selectedSize.cat}`,
        pelucheId: pelucheBD.id,
        quantite: String(quantite),
        prixTotal: prixTotalCalcule,
        paiement: "Attente Livraison",
        statut: "payé",
        statut_livraison: "EN_ATTENTE",
        statut_paiement: "ATTENTE_LIVRAISON",
        montantRembourse: 0,
        vendeur: "Vitrine"
      });

      const pelucheRef = doc(db, "peluches", pelucheBD.id);
      await updateDoc(pelucheRef, {
        stock: Number(pelucheBD.stock) - Number(quantite)
      });

      const message = `✨ *NOUVELLE COMMANDE* ✨\n\n👤 *Client :* ${formData.nom}\n📍 *Lieu :* ${formData.lieu}\n📞 *Contact :* ${formData.tel}\n--------------------------\n🧸 *Article :* ${selectedSize.taille} ${formData.couleur} ${selectedSize.cat}\n🔢 *Quantité :* ${quantite}\n💰 *Prix Total :* ${prixTotalCalcule.toLocaleString()} FCFA\n--------------------------\n🚀 _Paiement à la livraison._`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
      
      setSelectedSize(null);
      // DECLENCHEMENT DE LA MODALE GEANTE
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la validation de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D2420]">
      
      {/* NAVIGATION */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-6 md:px-12 py-4 flex justify-between items-center border-b border-gray-50">
        <div 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 animate-bounce">
            <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-[#2D2420] leading-tight uppercase">Magasin de peluches<br/>Cameroun</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-[#2D2420]/70 uppercase tracking-tight">
          <button onClick={() => scrollToSection('collections')} className="hover:text-[#E35D4E] transition-colors">Collection</button>
          <button onClick={() => scrollToSection('apropos')} className="hover:text-[#E35D4E] transition-colors">Livraison</button>
          <button onClick={() => scrollToSection('avis')} className="hover:text-[#E35D4E] transition-colors">Avis</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-6 pt-16 pb-20 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span>✨</span><p>Livraison partout au Cameroun</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#2D2420] leading-[1.1]">Dites-lui Je t'aime <br/>en format géant ! 🧸✨</h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md">Plus qu'un simple cadeau, offrez un câlin éternel. Nos peluches premium, ultra-douces et XXL, sont prêtes à conquérir son cœur.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollToSection('collections')} className="bg-[#E35D4E] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">Voir la collection ↓</button>
            <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')} className="bg-[#5C4B43] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">Commander sur WhatsApp</button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img src="/images/SV.jpeg" alt="Promo" className="w-full h-auto rounded-[3rem] shadow-2xl" />
        </div>
      </section>

      {/* CATALOGUE */}
      <main id="collections" className="px-6 pb-32 max-w-7xl mx-auto space-y-40 scroll-mt-24">
        {['PREMIUM', 'STANDARD'].map(cat => (
          <div key={cat} className="space-y-16">
            <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter border-b border-orange-100 pb-8">
                {cat === 'PREMIUM' ? '✨ Spécial Saint-Valentin' : '🧸 Collection Classique'}
            </h3>
            <div className={`grid grid-cols-1 ${cat === 'PREMIUM' ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-12`}>
              {catalogueFixe.filter(p => p.cat === cat).map(p => (
                <div key={p.id} onClick={() => { setSelectedSize(p); setQuantite(1); }} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] bg-white rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700">
                    <img src={`/images/${cat.toLowerCase()}-${p.taille}.jpeg`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-3xl shadow-xl">
                        <span className="text-xl font-black">{p.prixAffiche.toLocaleString()} F</span>
                    </div>
                  </div>
                  <div className="mt-8 px-4 flex justify-between items-center">
                    <div>
                        <h4 className="text-3xl font-black italic uppercase">{p.taille} CM</h4>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{p.desc}</p>
                    </div>
                    <div className="bg-[#1A1513] text-white p-4 rounded-2xl group-hover:bg-[#E35D4E] transition-colors"><ArrowRight size={20}/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* SESSION AVIS */}
      <section id="avis" className="px-6 py-32 bg-[#FDFCFB] scroll-mt-24">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
          <span className="text-[#E35D4E] font-bold text-xs uppercase tracking-[0.3em]">Témoignages</span>
          <h2 className="text-5xl md:text-6xl font-black text-[#2D2420] italic uppercase tracking-tighter">Nos clients heureux</h2>
          <p className="text-gray-400 font-medium">Découvrez les avis de nos clients satisfaits sur TikTok</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {avisClients.map((avis) => (
            <div key={avis.id} className="relative group">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl border-4 border-white">
                <img src={avis.img} className="w-full h-full object-cover" alt={avis.nom} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {avis.badge && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2">
                        {avis.badge}
                    </div>
                )}
                <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FACC15" className="text-[#FACC15]" />)}
                  </div>
                  <p className="font-black text-lg leading-tight uppercase italic">{avis.nom}</p>
                  <p className="text-gray-200 text-xs font-medium leading-relaxed italic">"{avis.text}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION LIVRAISON */}
      <section id="apropos" className="px-6 py-32 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#2D2420] uppercase tracking-tighter italic">Livraison partout au Cameroun</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
          <div className="bg-orange-50/30 p-10 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-orange-50/50">
            <Truck size={40} className="text-[#E35D4E] mb-2" />
            <h4 className="font-black text-lg uppercase italic">Livraison rapide</h4>
            <p className="text-gray-400 text-sm font-bold">24-48h</p>
          </div>
          <div className="bg-orange-50/30 p-10 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-orange-50/50">
            <Package size={40} className="text-[#E35D4E] mb-2" />
            <h4 className="font-black text-lg uppercase italic">Emballage sécurisé</h4>
            <p className="text-gray-400 text-sm font-bold">Protégé</p>
          </div>
          <div className="bg-orange-50/30 p-10 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-orange-50/50">
            <Headphones size={40} className="text-[#E35D4E] mb-2" />
            <h4 className="font-black text-lg uppercase italic">Service 24h/24</h4>
            <p className="text-gray-400 text-sm font-bold">Support client</p>
          </div>
          <div className="bg-orange-50/30 p-10 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-orange-50/50">
            <MapPin size={40} className="text-[#E35D4E] mb-2" />
            <h4 className="font-black text-lg uppercase italic">Retrait possible</h4>
            <p className="text-gray-400 text-sm font-bold">Points relais</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-32 items-center border-t border-gray-100 pt-16">
          <div className="flex items-center gap-4">
            <MapPin size={32} className="text-[#E35D4E]" />
            <div>
              <h5 className="font-black text-xl italic uppercase">Yaoundé</h5>
              <p className="text-gray-400 font-bold uppercase text-[12px]">BONAS (Ancienne poubelle)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin size={32} className="text-[#E35D4E]" />
            <div>
              <h5 className="font-black text-xl italic uppercase">Douala</h5>
              <p className="text-gray-400 font-bold uppercase text-[12px]">Carrefour Agip</p>
            </div>
          </div>
        </div>
      </section>

      {/* MODALE DE COMMANDE */}
      {selectedSize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1513]/60 backdrop-blur-md" onClick={() => !isSubmitting && setSelectedSize(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 max-h-[90vh]">
            <div className="hidden md:block w-1/2">
                <img src={`/images/${selectedSize.cat.toLowerCase()}-${selectedSize.taille}.jpeg`} className="w-full h-full object-cover" alt=""/>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-4xl font-black italic uppercase leading-none">{selectedSize.taille} CM</h3>
                    <button onClick={() => setSelectedSize(null)} className="p-3 bg-gray-50 rounded-full"><X size={24}/></button>
                </div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couleurs disponibles en stock</label>
                        <div className="flex flex-wrap gap-2">
                            {[...new Set(produitsStock
                                .filter(p => p.categorie === selectedSize.cat && Number(p.taille) === Number(selectedSize.taille))
                                .map(p => p.couleur)
                            )].map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => setFormData({...formData, couleur: c})} 
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${
                                        formData.couleur === c 
                                        ? 'bg-[#1A1513] text-white border-[#1A1513]' 
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200'
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[2rem]">
                        <span className="text-[10px] font-black uppercase text-gray-400">Quantité</span>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl">
                            <button onClick={() => setQuantite(Math.max(1, quantite - 1))} className="p-2"><Minus size={18}/></button>
                            <span className="font-black text-xl">{quantite}</span>
                            <button onClick={() => setQuantite(quantite + 1)} className="p-2"><Plus size={18}/></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="NOM COMPLET" className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-xs font-black outline-none focus:ring-2 ring-orange-100" onChange={(e) => setFormData({...formData, nom: e.target.value})}/>
                        <input type="tel" placeholder="TÉLÉPHONE WHATSAPP" className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-xs font-black outline-none focus:ring-2 ring-orange-100" onChange={(e) => setFormData({...formData, tel: e.target.value})}/>
                        <input type="text" placeholder="QUARTIER" className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-xs font-black outline-none focus:ring-2 ring-orange-100" onChange={(e) => setFormData({...formData, lieu: e.target.value})}/>
                    </div>
                    <button onClick={enregistrerEtCommander} disabled={isSubmitting} className="w-full bg-[#E35D4E] text-white py-6 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-4 shadow-xl shadow-red-200">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <MessageCircle size={22}/>}
                        {isSubmitting ? "Patientez..." : "Commander maintenant"}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#2D2420] text-white pt-24 pb-12 px-6 md:px-24 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <img src="/images/logo.jpeg" alt="Logo" className="w-12 h-12 object-contain rounded-xl bg-white p-1" />
              <h4 className="text-xl font-black uppercase italic leading-tight tracking-tighter">Magasin de peluches<br/>Cameroun</h4>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[250px]">
              Votre boutique en ligne de nounours géants au Cameroun. Des peluches ultra-douces pour offrir le plus beau des cadeaux.
            </p>
            <div className="flex items-center gap-5 pt-4">
               <button onClick={() => window.open('https://www.tiktok.com/@peluche.store.cameroun?_r=1&_t=ZM-92llLD3AzTI', '_blank')} className="hover:text-[#E35D4E] transition-colors"><MessageCircle size={22}/></button>
               <button className="hover:text-[#E35D4E] transition-colors"><Instagram size={22}/></button>
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-lg font-black uppercase tracking-widest italic">Contact</h5>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-300 font-bold group">
                <Phone size={18} className="text-[#E35D4E]" />
                <span className="text-sm">691 154 011</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 font-bold">
                <Star size={18} className="text-[#E35D4E]" fill="currentColor" />
                <span className="text-sm uppercase italic">24h/24</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-lg font-black uppercase tracking-widest italic">Points de Retrait</h5>
            <div className="space-y-6 text-gray-300 font-bold">
              <div className="flex items-center gap-4">
                <MapPin size={18} className="text-[#E35D4E]" />
                <span className="text-sm">Yaoundé – BONAS</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={18} className="text-[#E35D4E]" />
                <span className="text-sm">Douala – Agip</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            <p>© 2026 Peluche Store Cameroun</p>
            <p>Made with ❤️ in 237</p>
        </div>
      </footer>

      {/* MODALE DE SUCCÈS PERSONNALISÉE (GRANDE ET JOLIE) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1513]/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[4rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle size={56} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-[#2D2420] mb-4">
              Envoi Réussi !
            </h3>
            <p className="text-gray-500 font-bold leading-relaxed mb-10 text-lg">
              Votre commande a été envoyée.<br/>
              Votre colis est désormais <span className="text-[#E35D4E]">réservé</span>. 🧸✨
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#1A1513] text-white py-6 rounded-[2rem] font-black uppercase text-xs hover:scale-105 transition-transform shadow-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
