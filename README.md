# azure-fn-apollo

https://becomelessevil.azurewebsites.net/api/graphql

`npm start` -> http://localhost:7071/api/graphql

* apollo graphql
* typescript
* azure functions, postgres

### Payload
```gql
{
  getOfferByID(id:"11-22-33-44"){
    name
    link
    price{
      currency
      amount
    }
  }
  getOfferByUrl(url:"httpbin.org"){
    category{
      amazon
    }
  }
  getOfferByASIN(asin:"334455", limit:5){
    name
  }
}
```

### /.env
```text
DB_HOST=yourdb.postgres.database.azure.com
DB_USER=
DB_NAME=
DB_PASSWORD=
```

### Azure

Create a postgres db and add you IP address, so you can create the _offers_ table.  
__Importantly!__ Change 'Allow access to Azure services' to on, see 'Connection Security'.
Otherwise, the app can't connect.

Then, create a 'Function App'. I chose "becomelessevil" as the app name.

Looking at the new FunctionApp there is a 'Configuration' in the menu which opens up 'Application settings'.  
Here you can set the parameters which become envars. Copy the values from dotenv, so the app can talk to postgres.

Deploy from this directory with this command:
```bash
func azure functionapp publish becomelessevil
```

Go here and paste in the payload.  
https://becomelessevil.azurewebsites.net/api/graphql

### Database

```sql
create table offers (
	id text primary key default uuid_generate_v4(),
	name text not null,
	link text not null,
	price numeric(20,2) not null,
	currency text not null,
	seller text not null
);
```

### Useful pages

https://www.apollographql.com/docs/apollo-server/deployment/azure-functions/#sample-code

https://www.aaron-powell.com/posts/2020-04-07-using-graphql-in-azure-functions-to-access-cosmosdb/

https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-azure-functions

https://johnliu.net/blog/2019/12/running-serverless-apollo-graphql-on-azurefunctions-with-cheap-azure-blob-table-databases

typescript, wrong `scriptFile`  
https://github.com/Azure/azure-functions-core-tools/issues/1992

gql types  
https://graphql.org/learn/schema/

ts types  
https://www.typescriptlang.org/docs/handbook/basic-types.html

Postgres  
https://node-postgres.com/features/queries  
https://docs.microsoft.com/en-us/azure/postgresql/connect-nodejs

`func azure functionapp publish` permission denied  
https://github.com/Azure/azure-functions-core-tools/issues/1798
