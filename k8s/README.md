# k8s/ – бажаний стан каршерінгу для ArgoCD (лаб. 7)

- Каталог синхронізує ArgoCD-застосунок `argocd/carsharing-app.yaml` (namespace `carsharing-gitops`).
- Secret `carsharing-secret` (DB_PASSWORD, JWT_SECRET) у Git **не зберігається**: його створюють
  окремо (`kubectl create secret generic ...`) або через Vault / Sealed Secrets.
- HPA прибрано: кількість реплік задається лише в Git, інакше автомасштабування конфліктує з selfHeal.
- Будь-яка зміна кластера – лише через коміт у цю гілку; відкат – `git revert`.
