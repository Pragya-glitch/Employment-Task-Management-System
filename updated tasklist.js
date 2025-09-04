 There's a critical bug in the TaskList.js component with the Select component.
Action: 'file_editor str_replace /app/frontend/src/components/TaskList.js --old-str
<SelectItem value="">Unassigned</SelectItem> --new-str                      
<SelectItem value="unassigned">Unassigned</SelectItem>'
