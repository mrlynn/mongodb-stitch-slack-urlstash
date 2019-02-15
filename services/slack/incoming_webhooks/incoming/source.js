
exports = async function(payload) {
  
   const mongodb = context.services.get("mongodb-atlas");
   const exampledb = mongodb.db("urlstash");
   const examplecoll = exampledb.collection("urls");
   
   const args=payload.query.text.split(" ");
   
   switch(args[0]) {
     case "stash":
       const result= await examplecoll.insertOne( { user_id: payload.query.user_id, when: Date.now(), url: args[1] });
       if(result) {
            return { text: `Stashed ${args[1]}` };   
       }
       return { text: `Error stashing` };
     case "list":
       const findresult = await examplecoll.find({}).toArray();
       const strres=findresult.map( x=> `<${x.url}|${x.url}>  by <@${x.user_id}> at ${new Date(x.when).toLocaleString()}`).join("\n");
       return { text: `Stash as of ${new Date().toLocaleString()}\n${strres}` };
     case "remove":
       const delresult = await examplecoll.deleteOne( { user_id: { $eq: payload.query.user_id }, url: { $eq: args[1]}});
       return { text: `Deleted ${delresult.deletedCount} stashed items` };
     default:
       return { text: "Unrecognized command - try new [url],list, or remove [url]" };
   }
}
