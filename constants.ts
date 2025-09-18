import React from 'react';
import type { Service, Wig, ProcessStep, CareTip, RepairExample } from './types';
import { ConsultationIcon, MeasurementIcon, CraftingIcon, StylingIcon, FittingIcon, FinalizationIcon } from './components/Icons';
import {
  WIG_ECLAT_DOR, WIG_FLAMME_ROUSSE, WIG_NUIT_DE_JAIS, WIG_TERRE_SIENNE,
  OVERLAY_ECLAT_DOR, OVERLAY_FLAMME_ROUSSE, OVERLAY_NUIT_DE_JAIS, OVERLAY_TERRE_SIENNE,
  CARE_WASH, CARE_STYLING, CARE_STORAGE,
  REPAIR_BEFORE_1, REPAIR_AFTER_1, REPAIR_BEFORE_2, REPAIR_AFTER_2
} from './assets/images';


export const SERVICES: Service[] = [
  {
    title: "Créations sur Mesure",
    description: "Nous concevons des perruques uniques qui correspondent parfaitement à votre style, votre morphologie et vos désirs. Chaque création est une œuvre d'art."
  },
  {
    title: "Réparation et Entretien",
    description: "Prolongez la vie de vos perruques avec nos services experts de réparation, de coiffage et d'entretien pour une apparence toujours impeccable."
  },
  {
    title: "Consultation & Vente",
    description: "Réservez une consultation privée pour explorer notre collection, recevoir des conseils d'experts et trouver la perruque de vos rêves."
  }
];

export const WIGS: Wig[] = [
  {
    id: 1,
    name: "L'Éclat d'Or",
    imageUrl: WIG_ECLAT_DOR,
    overlayUrl: OVERLAY_ECLAT_DOR,
    description: "Une perruque blonde luxuriante aux ondulations douces, confectionnée à la main pour un réalisme et un confort absolus. Parfaite pour un look glamour et ensoleillé.",
  },
  {
    id: 2,
    name: 'La Flamme Rousse',
    imageUrl: WIG_FLAMME_ROUSSE,
    overlayUrl: OVERLAY_FLAMME_ROUSSE,
    description: "Incarnez la passion avec cette perruque rousse vibrante. Sa coupe moderne et sa couleur intense captent la lumière et les regards.",
  },
  {
    id: 3,
    name: 'Nuit de Jais',
    imageUrl: WIG_NUIT_DE_JAIS,
    overlayUrl: OVERLAY_NUIT_DE_JAIS,
    description: "Élégance intemporelle et sophistication définissent cette perruque d'un noir profond. Sa texture soyeuse et son tombé parfait en font un classique indispensable.",
  },
  {
    id: 4,
    name: 'Terre de Sienne',
    imageUrl: WIG_TERRE_SIENNE,
    overlayUrl: OVERLAY_TERRE_SIENNE,
    description: "La chaleur d'un brun Sienne lumineux. Une coupe versatile aux reflets riches qui apporte profondeur et caractère.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  { id: 1, title: 'Consultation & Design', description: "Tout commence par un échange. Nous discutons de vos envies, de votre style et définissons ensemble la perruque de vos rêves.", icon: ConsultationIcon },
  { id: 2, title: 'Prise de Mesures', description: "La précision est la clé d'un confort absolu. Nous prenons des mesures détaillées pour garantir un ajustement parfait.", icon: MeasurementIcon },
  { id: 3, title: 'Confection Artisanale', description: "Nos artisans implantent manuellement chaque cheveu sur une base de tulle fine, un travail méticuleux pour un rendu naturel.", icon: CraftingIcon },
  { id: 4, title: 'Coupe & Coiffage', description: "Une fois confectionnée, la perruque est coupée, colorée et coiffée par nos stylistes pour correspondre au design validé.", icon: StylingIcon },
  { id: 5, title: 'Essayage & Ajustements', description: "Vous essayez votre perruque pour la première fois. Nous procédons aux ajustements finaux pour un confort et un look parfaits.", icon: FittingIcon },
  { id: 6, title: 'Finalisation & Conseils', description: "Votre création est prête. Nous vous donnons tous les conseils nécessaires pour son entretien au quotidien.", icon: FinalizationIcon },
];

export const CARE_TIPS: CareTip[] = [
    { 
        id: 1, 
        title: "Lavage Délicat", 
        content: "Utilisez de l'eau tiède et un shampoing doux sans sulfates. Immergez la perruque et pressez doucement la mousse à travers les cheveux, sans frotter. Rincez abondamment et appliquez un conditionneur, en évitant les racines et le bonnet. Laissez sécher à l'air libre sur un porte-perruque.",
        imageUrl: CARE_WASH
    },
    { 
        id: 2, 
        title: "Coiffage & Démêlage", 
        content: "Utilisez toujours un peigne à dents larges ou vos doigts pour démêler, en commençant par les pointes et en remontant vers les racines. Pour les perruques synthétiques, évitez les appareils chauffants sauf si elles sont thermorésistantes. Pour les cheveux naturels, utilisez un protecteur de chaleur.",
        imageUrl: CARE_STYLING
    },
    { 
        id: 3, 
        title: "Rangement Optimal", 
        content: "Lorsque vous ne la portez pas, gardez votre perruque sur un porte-perruque ou une tête de mannequin pour maintenir sa forme. Évitez l'exposition directe au soleil, à la poussière et à l'humidité. Un rangement adéquat est la clé de sa longévité et de la préservation de son style.",
        imageUrl: CARE_STORAGE
    },
];

export const REPAIR_EXAMPLES: RepairExample[] = [
    {
        id: 1,
        title: "Soin Réparateur & Brillance",
        beforeUrl: REPAIR_BEFORE_1,
        afterUrl: REPAIR_AFTER_1
    },
    {
        id: 2,
        title: "Retouche Couleur & Vitalité",
        beforeUrl: REPAIR_BEFORE_2,
        afterUrl: REPAIR_AFTER_2
    },
];