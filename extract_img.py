from PIL import ImageGrab
import win32com.client as win32
import sys

print("argv 1:", sys.argv[1])
print("argv 2:", sys.argv[2])
file_path=sys.argv[1]
img_path=sys.argv[2]

excel = win32.gencache.EnsureDispatch('Excel.Application')
#workbook = excel.Workbooks.Open("C:/Users/Abhishek/Downloads/Project-resources/Resources/fp-pcr.xls")
workbook = excel.Workbooks.Open(file_path)
num = 1
size=(0,0)
for sheet in workbook.Worksheets:
	for i, shape in enumerate(sheet.Shapes):
		if shape.Name.startswith('Picture'):
			#print('shape-- ',shape)
			shape.Copy()
			image = ImageGrab.grabclipboard()
			print('Name: ',shape.Name,'    size-- ',image.size)
			if image.size>size:
				size=image.size
				finalImg=image
			num+=1
print('test--',size)
#finalImg.convert('RGB').save(r"C:\backup\Git Project\ct_tyre_test_backend\assets\uploads\{}.jpg".format(num), 'jpeg')
finalImg.convert('RGB').save(img_path, 'jpeg')
excel.Quit()
exit