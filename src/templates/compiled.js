(function(){ exports.JST || (exports.JST = {}) 
; (function(){dust.register("tasks",body_0);function body_0(chk,ctx){return chk.section(ctx.get("tasks"),ctx,{"block":body_1},null);}function body_1(chk,ctx){return chk.write("# begin Tasks").section(ctx.get("task"),ctx,{"block":body_2},null).write("# end Tasks");}function body_2(chk,ctx){return chk.write("# ## *#").reference(ctx.get("name"),ctx,"h").write("*# ").reference(ctx.get("description"),ctx,"h").write("task '").reference(ctx.get("name"),ctx,"h").write("', '").reference(ctx.get("description"),ctx,"h").write("', (").reference(ctx.get("args"),ctx,"h").write(")-> ").reference(ctx.get("safe_name"),ctx,"h").write(" -> log ':)', green").reference(ctx.get("safe_name"),ctx,"h").write(" = (").reference(ctx.get("args"),ctx,"h").write(")->").section(ctx.get("invocations"),ctx,{"block":body_3},null);}function body_3(chk,ctx){return chk.write("# ").reference(ctx.get("discription"),ctx,"h").reference(ctx.get("body"),ctx,"h");}return body_0;})();
exports.JST["tasks"] = function(data, cb){ dust.render("tasks", data, cb); };

})();
