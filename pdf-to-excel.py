import tabula
import sys

print("argv 1:", sys.argv[1])
print("argv 2:", sys.argv[2])

file_path=sys.argv[1]
dir_path=sys.argv[2]

df = tabula.read_pdf(file_path, pages = 'all')

for i in range(len(df)):
 df[i].to_excel(dir_path+'/file_'+str(i)+'.xlsx')