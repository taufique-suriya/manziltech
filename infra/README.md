# Infrastructure (Terraform)

Azure resources for ManzilTech, as code. Production first; staging joins later by import.
Why and how it is set up: planning decisions 0009 (hosting) and 0010 (production infrastructure and DNS).

```
infra/
  terraform/
    modules/static-site/   one Static Web App and its custom domains
    envs/prd/              production: resource group 'rg-manziltech-prd' and four sites
```

Terraform manages Azure only. GitHub environments, secrets and variables are set in the GitHub UI,
and DNS records are added by hand at Hostinger.

## Rules
- The repository is public. Never commit state, '*.tfvars', tokens or the subscription ID.
- State holds the deployment tokens. Keep access to the state container to the owner.
- Read every plan before applying. Nothing applies unattended.
- Infrastructure changes go through a pull request like code.

## Prerequisites
- Azure CLI and Terraform 1.16 or newer, signed in with 'az login --tenant <tenant-id>' (multi-factor).
- The right subscription selected ('az account show').
- Resource providers 'Microsoft.Web' and 'Microsoft.Resources' registered on the subscription
  (Terraform's automatic registration is off): 'az provider show --namespace Microsoft.Web --query registrationState -o tsv'.

## One-time: state storage
Terraform cannot create the place that holds its own state, so this is done once by hand.
The storage account name must be globally unique. If the check says it is taken, pick another
and update 'storage_account_name' in 'terraform/envs/prd/backend.hcl' to match.

~~~powershell
$rg = 'rg-manziltech-tfstate'
$sa = 'stmanziltechtfstate'

az storage account check-name --name $sa --query "{available:nameAvailable, reason:reason}" -o table

az group create --name $rg --location centralindia
az storage account create --name $sa --resource-group $rg --location centralindia `
  --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 `
  --allow-blob-public-access false --allow-shared-key-access false
az storage account blob-service-properties update --account-name $sa --resource-group $rg `
  --enable-versioning true --enable-delete-retention true --delete-retention-days 14

# Access is through Entra ID, not storage keys: grant yourself the data role.
$me = az ad signed-in-user show --query id -o tsv
$scope = az storage account show --name $sa --resource-group $rg --query id -o tsv
az role assignment create --assignee-object-id $me --assignee-principal-type User `
  --role 'Storage Blob Data Contributor' --scope $scope

# Wait about a minute for the role to take effect, then:
az storage container create --name tfstate --account-name $sa --auth-mode login
~~~

If a command says a resource provider is not registered, run
'az provider register --namespace Microsoft.Storage' (or the namespace it names) and retry.

## Create or change production
~~~powershell
cd infra\terraform\envs\prd
copy terraform.tfvars.example terraform.tfvars    # then put your subscription ID in it
terraform init "-backend-config=backend.hcl"    # quotes needed in PowerShell
terraform plan -out prd.tfplan
terraform apply prd.tfplan
~~~

The first plan should show 5 resources to add: the resource group and four Static Web Apps.

## Deployment tokens
Copy each token straight to the clipboard (it is not printed), then paste it into the GitHub
environment 'prd' as the secret named below.

~~~powershell
(terraform output -json deployment_tokens | ConvertFrom-Json).hub | Set-Clipboard           # AZURE_SWA_TOKEN_HUB
(terraform output -json deployment_tokens | ConvertFrom-Json).hajjandumrah | Set-Clipboard  # AZURE_SWA_TOKEN_HAJJANDUMRAH
(terraform output -json deployment_tokens | ConvertFrom-Json).bookings | Set-Clipboard      # AZURE_SWA_TOKEN_BOOKINGS
(terraform output -json deployment_tokens | ConvertFrom-Json).studio | Set-Clipboard        # AZURE_SWA_TOKEN_STUDIO
~~~

The addresses of the sites (targets for the DNS records):

~~~powershell
terraform output default_host_names
~~~

## Custom domains
1. At Hostinger, add a CNAME record per subdomain (for example name 'bookings', target the site's
   host name from the output above).
2. In 'terraform.tfvars', add the matching 'custom_domains' entries (see the example file).
3. 'terraform plan', then 'terraform apply'. The apply waits until Azure sees the record, which can
   take several minutes. Certificates are issued and renewed by Azure.
4. The root domain (manziltech.com) uses 'validation_type = "dns-txt-token"' and depends on what
   Hostinger supports; see decision 0010 before touching it.

## Updating the provider
The provider version is pinned in 'envs/prd/versions.tf' and recorded in '.terraform.lock.hcl'
(committed, with Windows and Linux hashes). To upgrade: change the version, run
'terraform init -upgrade "-backend-config=backend.hcl"', then
'terraform providers lock -platform=windows_amd64 -platform=linux_amd64', and review the plan.
