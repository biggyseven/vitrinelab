# ÉLORIA BEAUTY — Démonstration e-commerce VitrineLab

## Ouvrir la boutique
Pour un fonctionnement cohérent entre les pages (panier, compte, commandes et administration), servez le dossier avec un petit serveur local : ouvrez un terminal dans ce dossier et lancez `python -m http.server 8000`, puis visitez `http://localhost:8000/`. Les polices Google nécessitent Internet ; le logo et les visuels produits sont locaux.

## Administration
Ouvrez `admin/index.html`. Identifiants de démonstration : `admin-demo` / `eloria-demo`. La connexion est simulée et ne constitue pas une protection de production.

## Fonctions incluses
- Catalogue de 30 produits fictifs répartis en 5 catégories et 6 marques conceptuelles.
- Recherche, filtres, tri, favoris, fiches produits et variantes.
- Panier, codes promotionnels, seuil de livraison gratuite, commande et reçu PDF de démonstration.
- Compte local, suivi de commande, points ÉLORIA PRIVILÈGE.
- Conseiller beauté, Journal ÉLORIA et assistant de questions prédéfinies.
- Administration locale : prix, stocks, commandes, alertes, réclamations, rapports et export CSV.

## Limites de la démonstration
ÉLORIA BEAUTY, ses marques, produits, prix, avis, commandes, stocks et clients sont fictifs. Aucun paiement réel, livraison, compte sécurisé, email, SMS ou service externe n'est connecté. Les données sont stockées dans le navigateur (`localStorage`) et ne se synchronisent pas entre appareils. Ne saisissez aucune donnée personnelle réelle. Les documents PDF sont uniquement des reçus de démonstration sans valeur comptable ou fiscale.

Pour un déploiement commercial, prévoir un backend sécurisé, une base de données, une authentification robuste côté serveur, une passerelle de paiement autorisée, une logistique réelle, des politiques légales vérifiées et une gestion conforme des données personnelles.
