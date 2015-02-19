#pragma once
#include "usbdevice.h"
#include "opc.h"
#include <set>

class OpcTcpDevice
{
 public:
  OpcTcpDevice(bool verbose, const Vaue &config);
  virtual ~OpcTcpDevice();

  virtual int attemptOpen();
  virtual void writeMessage(const OPC::Message &msg);
  virtual std::string getName();
  virtual void flush();

  // Send current buffer contents
  void writeFramebuffer();

    // Framebuffer accessor
    uint8_t *fbPixel(unsigned num) {
        return &mFramebuffer[num / PIXELS_PER_PACKET].data[3 * (num % PIXELS_PER_PACKET)];
    }

private:
};
