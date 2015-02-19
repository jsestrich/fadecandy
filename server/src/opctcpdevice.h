#pragma once
#include "rapidjson/document.h"
#include "usbdevice.h"
#include "opc.h"
#include "opc_client.h"
#include <set>

class OpcTcpDevice
{
 public:
  typedef rapidjson::Value Value;
  typedef rapidjson::Document Document;
  typedef rapidjson::MemoryPoolAllocator<> Allocator;

  OpcTcpDevice(bool verbose);
  virtual ~OpcTcpDevice();

  virtual int attemptOpen();
  virtual void writeMessage(const OPC::Message &msg);
private:
  OPCClient mClient;
};
