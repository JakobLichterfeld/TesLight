/**
 * @file FileUtil.cpp
 * @author TheRealKasumi
 * @brief Implementation of the {@link TesLight::FileUtil}.
 *
 * @copyright Copyright (c) 2022
 *
 */
#include "util/FileUtil.h"

/**
 * @brief Check if a file exists on the file system.
 * @param fileSystem where the file is stored
 * @param fileName full path and name of the file
 * @return true when the file exists
 * @return false when the file does not exist
 */
bool TesLight::FileUtil::fileExists(FS *fileSystem, const String fileName)
{
	File file = fileSystem->open(fileName, FILE_READ);
	if (!file)
	{
		return false;
	}
	else if (file.isDirectory())
	{
		file.close();
		return false;
	}

	file.close();
	return true;
}

/**
 * @brief Check if a directory exists on the file system.
 * @param fileSystem where the directory is stored
 * @param path full path and name of the directory
 * @return true when the directory exists
 * @return false when the directory does not exist
 */
bool TesLight::FileUtil::directoryExists(FS *fileSystem, const String path)
{
	File file = fileSystem->open(path, FILE_READ);
	if (!file)
	{
		return false;
	}
	else if (!file.isDirectory())
	{
		file.close();
		return false;
	}

	file.close();
	return true;
}

/**
 * @brief Calculate a identifier for a file based on it's properties and content.
 * @param fileSystem where the file is located
 * @param fileName full path and name of the file
 * @param identifier reference to the variable holding the identifier
 * @return true when successful
 * @return false when there was an error
 */
bool TesLight::FileUtil::getFileIdentifier(FS *fileSystem, const String fileName, uint32_t &identifier)
{
	File file = fileSystem->open(fileName, FILE_READ);
	if (!file)
	{
		return false;
	}
	else if (file.isDirectory())
	{
		file.close();
		return false;
	}

	identifier = 7;
	for (uint16_t i = 0; i < fileName.length(); i++)
	{
		identifier = identifier * 31 + (uint8_t)fileName[i];
	}
	identifier = identifier * 31 + file.size();
	identifier = identifier * 31 + file.getLastWrite();

	file.close();
	return true;
}

/**
 * @brief Count the number of files and optinally directories inside a directory.
 * @param fileSystem where the root directory is located
 * @param directory full path and name to the root directory
 * @param count reference variable, number of counted files and directories will be written here
 * @param includeDirs true to include directories, false to only count files
 * @return true when the counting was successful
 * @return false when there was an error counting
 */
bool TesLight::FileUtil::countFiles(FS *fileSystem, const String directory, uint16_t &count, const bool includeDirs)
{
	File dir = fileSystem->open(directory, FILE_READ);
	if (!dir)
	{
		return false;
	}
	else if (!dir.isDirectory())
	{
		dir.close();
		return false;
	}

	count = 0;
	bool hasNext = true;
	while (hasNext)
	{
		File file = dir.openNextFile(FILE_READ);
		if (file)
		{
			if (includeDirs || !file.isDirectory())
			{
				count++;
			}
			file.close();
		}
		else
		{
			hasNext = false;
		}
	}

	dir.close();
	return true;
}

/**
 * @brief Get a list of all files, optinally directories and their file size in bytes. The list is seperated by newline.
 * @param fileSystem where the root directory is located
 * @param directory root directory for the search
 * @param fileList reference variable, the list is stored here
 * @param includeDirs true to include directories, false to only list files
 * @return true when the list was created successfully
 * @return false when there was an error
 */
bool TesLight::FileUtil::getFileList(FS *fileSystem, const String directory, String &fileList, const bool includeDirs)
{
	File dir = fileSystem->open(directory, FILE_READ);
	if (!dir)
	{
		return false;
	}
	else if (!dir.isDirectory())
	{
		dir.close();
		return false;
	}

	fileList.clear();
	bool hasNext = true;
	while (hasNext)
	{
		File file = dir.openNextFile(FILE_READ);
		if (file)
		{
			if (includeDirs || !file.isDirectory())
			{
				uint32_t id = 0;
				if (TesLight::FileUtil::getFileIdentifier(fileSystem, directory + F("/") + file.name(), id))
				{
					fileList += String(file.name()) + F(";");
					fileList += String(file.size()) + F(";");
					fileList += String(id) + F("\n");
				}
			}
			file.close();
		}
		else
		{
			hasNext = false;
		}
	}

	dir.close();

	if (fileList.length() > 0)
	{
		fileList = fileList.substring(0, fileList.length() - 1);
	}

	return true;
}

/**
 * @brief Get the name of a file or directory based on it's index in the file system.
 * @param fileSystem where the file is located
 * @param directory root directory for the file or directory search
 * @param fileIndex index of the file or directory in the file system
 * @param fileName reference to the full file or directory name
 * @param includeDirs true to include directories, false to only include files
 * @return true when the seach was successful
 * @return false when there was an error
 */
bool TesLight::FileUtil::getFileNameFromIndex(FS *fileSystem, const String directory, const uint16_t fileIndex, String &fileName, const bool includeDirs)
{
	File dir = fileSystem->open(directory, FILE_READ);
	if (!dir)
	{
		return false;
	}
	else if (!dir.isDirectory())
	{
		dir.close();
		return false;
	}

	uint16_t currentIndex = 0;
	bool hasNext = true;
	while (hasNext)
	{
		File file = dir.openNextFile(FILE_READ);
		if (file)
		{
			if (includeDirs || !file.isDirectory())
			{
				if (currentIndex == fileIndex)
				{
					fileName = file.name();
					hasNext = false;
				}
				currentIndex++;
			}
			file.close();
		}
		else
		{
			fileName.clear();
			hasNext = false;
		}
	}

	dir.close();
	return true;
}

/**
 * @brief Get the file name from a file located in the targe directory with a matching identifier.
 * @param fileSystem where the file should be located
 * @param directory where to look for the file
 * @param identifier id of the file
 * @param fileName reference variable holding the found file name
 * @return true when the search was successful
 * @return false when there was an error
 */
bool TesLight::FileUtil::getFileNameFromIdentifier(FS *fileSystem, const String directory, const uint32_t identifier, String &fileName)
{
	File dir = fileSystem->open(directory, FILE_READ);
	if (!dir)
	{
		return false;
	}
	else if (!dir.isDirectory())
	{
		dir.close();
		return false;
	}

	bool hasNext = true;
	while (hasNext)
	{
		File file = dir.openNextFile(FILE_READ);
		if (file)
		{
			if (!file.isDirectory())
			{
				uint32_t id = 0;
				if (TesLight::FileUtil::getFileIdentifier(fileSystem, directory + F("/") + file.name(), id))
				{
					if (id == identifier)
					{
						fileName = file.name();
						hasNext = false;
					}
				}
			}
			file.close();
		}
		else
		{
			fileName.clear();
			hasNext = false;
		}
	}

	dir.close();
	return true;
}

/**
 * @brief Recursively delete a directory with all it's contents.
 * @param fileSystem where the root directory is located
 * @param directory full path and name to the directory that should be deleted
 * @param removeDir true to remove the empty root directory, false to keep it
 * @return true when the directory was deleted
 * @return false when there was an error
 */
bool TesLight::FileUtil::deleteDirectory(FS *fileSystem, const String directory, const bool removeDir)
{
	uint16_t fileCount = 0;
	if (!TesLight::FileUtil::countFiles(fileSystem, directory, fileCount, true))
	{
		return false;
	}

	for (uint16_t i = 0; i < fileCount; i++)
	{
		String name;
		if (!TesLight::FileUtil::getFileNameFromIndex(fileSystem, directory, i, name, true))
		{
			return false;
		}
		name = directory == F("/") ? (String)F("/") + name : directory + F("/") + name;

		if (name == LOG_FILE_NAME || name == CONFIGURATION_FILE_NAME || name == FSEQ_DIRECTORY || name == UPDATE_DIRECTORY)
		{
			continue;
		}

		if (TesLight::FileUtil::directoryExists(fileSystem, name))
		{
			if (!TesLight::FileUtil::deleteDirectory(fileSystem, name, true))
			{
				return false;
			}
			i--;
			fileCount--;
		}
		else if (TesLight::FileUtil::fileExists(fileSystem, name))
		{
			if (!fileSystem->remove(name))
			{
				return false;
			}
			i--;
			fileCount--;
		}
		else
		{
			return false;
		}
	}

	if (removeDir)
	{
		return fileSystem->rmdir(directory);
	}

	return true;
}

/**
 * @brief Clear the root directory of a file system.
 * @param filesSystem which root should be cleared
 * @return true when cleared successfully
 * @return false when there was an error
 */
bool TesLight::FileUtil::clearRoot(FS *filesSystem)
{
	return TesLight::FileUtil::deleteDirectory(filesSystem, F("/"), false);
}
